#[macro_use]
extern crate redis_async;

mod sign;
mod libs;

use std::{ env, io::Result };
use dotenv::dotenv;

use actix_web::{ HttpServer, App, middleware };
use actix_redis::RedisActor;
use actix_identity::{ IdentityService, CookieIdentityPolicy };

// ? Use in dev environment
use actix_web::http;
use actix_cors::Cors;

use crate::sign::services::sign_services;

#[actix_rt::main]
async fn main() -> Result<()> {
    dotenv().ok();

    HttpServer::new(move || {
        let redis = RedisActor::start("127.0.0.1:6379");

        App::new()
            // ? Use in dev environment
            .wrap(
                Cors::new()
                    .allowed_origin("http://localhost:4200")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .supports_credentials()
                    .max_age(86400)
                    .finish()
            )
            .wrap(middleware::Compress::default())
            .wrap(
                IdentityService::new(
                    CookieIdentityPolicy::new(
                        env::var("cookie_secret").unwrap().as_bytes()
                    )                            
                    .name("auth")
                    .secure(false)
                )
            )
            .data(redis)
            .configure(sign_services)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}