use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct APIResponse {
    pub success: bool,
    pub detail: String,
}

#[derive(Deserialize)]
pub struct SignForm {
    pub username: String,
    pub password: String,
}
