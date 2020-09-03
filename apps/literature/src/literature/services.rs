use actix_web::{
    get, post,
    web::{Data, Json, Path, ServiceConfig},
    HttpResponse,
};
use actix_identity::Identity;

use uuid::Uuid;
use sqlx::PgPool;

use crate::literature::models::{ApiResponse, BorrowForm, Literature, LiteratureForm};
use crate::libs::jwt::decode;
use crate::libs::encode::decrypt;

#[get("/")]
pub async fn api_test() -> String {
    "Hello World".to_owned()
}

#[post("/api/literature/new")]
pub async fn add_book(literature: Json<LiteratureForm>, connection: Data<PgPool>) -> HttpResponse {
    let response = Literature::add(&connection, literature.into_inner()).await;

    match response {
        Ok(_) => HttpResponse::Ok().json(ApiResponse { success: true }),
        Err(_) => HttpResponse::InternalServerError().json(ApiResponse { success: false }),
    }
}

#[get("/api/literature/list")]
pub async fn list(connection: Data<PgPool>) -> HttpResponse {
    let response = Literature::list(&connection, 0).await;

    match response {
        Ok(literatures) => HttpResponse::Ok().json(literatures),
        Err(_) => HttpResponse::InternalServerError().json(ApiResponse { success: false }),
    }
}

#[get("/api/literature/list/{pagination}")]
pub async fn pagination(connection: Data<PgPool>, pagination: Path<u32>) -> HttpResponse {
    let response = Literature::list(&connection, *pagination).await;

    match response {
        Ok(literatures) => HttpResponse::Ok().json(literatures),
        Err(_) => HttpResponse::InternalServerError().json(ApiResponse { success: false }),
    }
}

#[post("/api/literature/borrow")]
pub async fn borrow(token: Identity, form: Json<BorrowForm>, connection: Data<PgPool>) -> HttpResponse {
    let jwt = decode(
        &decrypt(
            &token.identity().unwrap()
        )
    ).unwrap();

    let uuid = Uuid::parse_str(&decrypt(&jwt.uuid)).unwrap();
    
    let response = Literature::borrow(&connection, uuid, form.into_inner().id).await;

    match response {
        Ok(literatures) => HttpResponse::Ok().json(literatures),
        Err(err) => {
            println!("{}", err);

            HttpResponse::InternalServerError().json(ApiResponse { success: false })
        },
    }
}

#[get("/api/literature/list_borrow")]
pub async fn list_borrow(token: Identity, connection: Data<PgPool>) -> HttpResponse {
    let jwt = decode(
        &decrypt(
            &token.identity().unwrap()
        )
    ).unwrap();

    let uuid = Uuid::parse_str(&decrypt(&jwt.uuid)).unwrap();

    let response = Literature::list_borrow(&connection, uuid).await;

    match response {
        Ok(id) => HttpResponse::Ok().json(id),
        Err(err) => {
            println!("{}", err);

            HttpResponse::InternalServerError().json(ApiResponse { success: false })
        }
    }
}

pub fn literature_services(config: &mut ServiceConfig) {
    config
        .service(api_test)
        .service(add_book)
        .service(list)
        .service(pagination)
        .service(borrow)
        .service(list_borrow);
}
