use std::env;

use magic_crypt::{new_magic_crypt, MagicCryptTrait};

pub fn encrypt(data: &str) -> String {
    let encoder = new_magic_crypt!(env::var("encode_secret").unwrap(), 256);

    encoder.encrypt_str_to_base64(data.to_owned())
}

pub fn decrypt(data: &str) -> String {
    let encoder = new_magic_crypt!(env::var("encode_secret").unwrap(), 256);

    encoder.decrypt_base64_to_string(&data).unwrap()
}
