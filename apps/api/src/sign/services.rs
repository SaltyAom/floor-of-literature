use actix::Addr;
use actix_identity::Identity;
use actix_redis::{Command, Error, RedisActor};
use actix_web::{
    get, post,
    web::{Data, Json, ServiceConfig},
    HttpResponse,
};

use std::time::Duration;
use tokio::time::delay_for;

use redis_async::resp::FromResp;

use uuid::Uuid;

use crate::sign::models::{APIResponse, SignForm};
use crate::libs::encode::{decrypt, encrypt};
use crate::libs::hash::pbkdf2;
use crate::libs::jwt::{ encode, decode };
use crate::libs::time::get_expire_time;

#[get("/api")]
pub async fn api_test() -> HttpResponse {
    HttpResponse::Ok().json(APIResponse {
        success: true,
        detail: "".to_owned(),
    })
}

#[post("/api/signup")]
pub async fn signup(
    redis: Data<Addr<RedisActor>>,
    sign: Json<SignForm>,
    token: Identity,
) -> Result<HttpResponse, Error> {
    // Reject if signed in
    if token.identity().is_some() {
        return Ok(HttpResponse::BadRequest().json(APIResponse {
            success: false,
            detail: "Already signed in".to_owned(),
        }));
    }

    // Requirment Validation
    if sign.username.len() < 5 {
        return Ok(HttpResponse::BadRequest().json(APIResponse {
            success: false,
            detail: "Username need to be atleast 5 characters".to_owned(),
        }));
    } else if sign.password.len() < 5 {
        return Ok(HttpResponse::BadRequest().json(APIResponse {
            success: false,
            detail: "Password need to be atleast 5 characters".to_owned(),
        }));
    }

    // Check user existance
    let user = encrypt(&format!("user:{}", sign.username));

    let user_existed = redis
        .send(Command(resp_array!["EXISTS", user.to_owned(), "uuid"]))
        .await;

    match user_existed {
        Ok(value) => {
            let existed = FromResp::from_resp(value.unwrap()).unwrap();

            if existed {
                return Ok(HttpResponse::BadRequest().json(APIResponse {
                    success: false,
                    detail: "This username has already been registered".to_owned(),
                }));
            }
        }
        // Server Error
        Err(_) => {
            return Ok(HttpResponse::InternalServerError().json(APIResponse {
                success: false,
                detail: "Interal server error".to_owned(),
            }))
        }
    };

    // Registration
    let response = redis
        .send(Command(resp_array![
            "HMSET",
            user.to_owned(),
            "password",
            encrypt(&pbkdf2(&sign.password)),
            "uuid",
            encrypt(&Uuid::new_v4().to_string())
        ]))
        .await;

    match response {
        Ok(_) => Ok(HttpResponse::Ok().json(APIResponse {
            success: true,
            detail: "Sign up successfully".to_owned(),
        })),
        // Server Error
        Err(_) => Ok(HttpResponse::InternalServerError().json(APIResponse {
            success: false,
            detail: "Interal server error".to_owned(),
        })),
    }
}

#[post("/api/signin")]
pub async fn signin(
    redis: Data<Addr<RedisActor>>,
    sign: Json<SignForm>,
    token: Identity,
) -> Result<HttpResponse, Error> {
    // Reject if signed in
    if token.identity().is_some() {
        return Ok(HttpResponse::BadRequest().json(APIResponse {
            success: false,
            detail: "Already signed in".to_owned(),
        }));
    }

    // Requirment Validation
    if sign.username.len() < 5 {
        return Ok(HttpResponse::BadRequest().json(APIResponse {
            success: false,
            detail: "Username need to be atleast 5 characters".to_owned(),
        }));
    } else if sign.password.len() < 5 {
        return Ok(HttpResponse::BadRequest().json(APIResponse {
            success: false,
            detail: "Password need to be atleast 5 characters".to_owned(),
        }));
    }

    // Data retrievation
    let user = encrypt(&format!("user:{}", sign.username));

    let find_user = redis
        .send(Command(resp_array![
            "HMGET",
            user.to_owned(),
            "uuid",
            "password"
        ]))
        .await;

    let (uuid, password): (String, String) = match find_user {
        Ok(value) => {
            // Determined if user existed from error
            let user: Option<Vec<String>> = match FromResp::from_resp(value.unwrap()) {
                Ok(response) => response,
                Err(_) => {
                    // ? Defer incorrect attempt
                    // By defering incorrect attempt, we can prioritize the
                    // successful signin performance.
                    // This can also slow down incoming attacker's attack.
                    delay_for(Duration::from_millis(1500)).await;

                    return Ok(HttpResponse::Unauthorized().json(APIResponse {
                        success: false,
                        // ? User is actually not existed.
                        // By displayed as incorrect, attacker will
                        // unable to determined if user is existed or not.
                        detail: "Username or password is incorrect".to_owned(),
                    }));
                }
            };

            if let Some(user) = user {
                let uuid = user[0].to_owned();
                let password = decrypt(&user[1]);

                (uuid, password)
            } else {
                // ? In some rare case where registration error, result might be null
                return Ok(HttpResponse::InternalServerError().json(APIResponse {
                    success: false,
                    detail: "Please contact the adminstrator".to_owned(),
                }));
            }
        }
        // Server Error
        Err(_) => {
            return Ok(HttpResponse::InternalServerError().json(APIResponse {
                success: false,
                detail: "Interal server error".to_owned(),
            }))
        }
    };

    // Password Validation
    if pbkdf2(&sign.password) != password {
        // ? Defer incorrect attempt
        // By defering incorrect attempt, we can prioritize the
        // successful signin performance.
        // This can also slow down incoming attacker's attack.
        delay_for(Duration::from_millis(500)).await;

        return Ok(HttpResponse::Unauthorized().json(APIResponse {
            success: false,
            detail: "Username or Password is incorrect".to_owned(),
        }));
    }

    // Create jwt token
    token.remember(
        encrypt(
            &encode(&uuid).unwrap()
        )
    );

    Ok(HttpResponse::Ok().json(APIResponse {
        success: true,
        detail: "Successfully sign in".to_owned(),
    }))
}

#[post("/api/signout")]
pub async fn signout(
    token: Identity
) -> HttpResponse {
    token.forget();

    HttpResponse::Ok()
        .json(APIResponse {
            success: true,
            detail: "Succesfully log out".to_owned()
        })
}

#[post("/api/refresh")]
pub async fn refresh(
    token: Identity
) -> HttpResponse {
    if token.identity().is_none() {
        return HttpResponse::Unauthorized()
            .json(
                APIResponse {
                    success: false,
                    detail: "Unauthorized".to_owned()
                }
            )
    }

    // Decode JWT encryption and decrypt base64 encryption
    let jwt = decode(
        &decrypt(
            &token.identity().unwrap()
        )
    ).unwrap();

    if jwt.exp < get_expire_time() {
        token.remember(
            encrypt(
                &encode(
                    &jwt.uuid
                ).unwrap()
            )
        );

        HttpResponse::Ok()
            .json(APIResponse {
                success: true,
                detail: "Refreshed token".to_owned()
            })
    } else {
        token.forget();

        HttpResponse::Unauthorized()
            .json(APIResponse {
                success: false,
                detail: "Token expired".to_owned()
            })
    }
}

pub fn sign_services(config: &mut ServiceConfig) {
    config
        .service(api_test)
        .service(signup)
        .service(signin)
        .service(signout)
        .service(refresh);
}
