use std::env;

use jsonwebtoken::{decode as jwt_decode, DecodingKey, Validation};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct AuthPayload {
    pub sub: String,
    pub uuid: String,
    pub exp: u128,
}

pub fn decode(token: &str) -> Option<AuthPayload> {
    let validation = Validation {
        sub: Some("token".to_owned()),
        ..Validation::default()
    };

    let auth_token = match jwt_decode::<AuthPayload>(
        &token,
        &DecodingKey::from_secret(&env::var("jwt_secret").unwrap().as_ref()),
        &validation,
    ) {
        Ok(value) => value,
        Err(_) => return None,
    };

    Some(auth_token.claims)
}
