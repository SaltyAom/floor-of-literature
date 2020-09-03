mod literature;
mod libs;

use std::env;
use dotenv::dotenv;

use actix_web::{ HttpServer, App, middleware };
use actix_identity::{ IdentityService, CookieIdentityPolicy };

// ? Use in dev environment
use actix_web::http;
use actix_cors::Cors;

use sqlx::postgres::PgPoolOptions;

use anyhow::Result;

use crate::literature::services::literature_services;

#[actix_rt::main]
async fn main() -> Result<()> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("Database URL");
    let connection_pool = PgPoolOptions::new().connect(&database_url).await?;

    HttpServer::new(move || {
        App::new()
            // ? Use in dev environment
            .wrap(
                Cors::new()
                    .allowed_origin("http://localhost:4200")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .supports_credentials()
                    .max_age(86400 * 3)
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
            .data(connection_pool.clone())
            .configure(literature_services)
    })
    .bind("127.0.0.1:8081")?
    .run()
    .await;

    Ok(())
}