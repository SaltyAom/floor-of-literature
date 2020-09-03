use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};

use uuid::Uuid;
use anyhow::Result;

#[derive(Serialize)]
pub struct ApiResponse {
    pub success: bool,
}

// Database's table representation
#[derive(FromRow, Serialize)]
pub struct Literature {
    pub id: i32,
    pub title: String,
    pub author: String,
}

// POST form
#[derive(Deserialize)]
pub struct LiteratureForm {
    pub title: String,
    pub author: String,
}

#[derive(Serialize, FromRow)]
pub struct BorrowID {
    pub literature: i32
}

#[derive(Deserialize)]
pub struct BorrowForm {
    pub id: i32
}

impl Literature {
    pub async fn add(connection: &PgPool, literature: LiteratureForm) -> Result<()> {
        sqlx::query!(
            r#"
            INSERT INTO literature(title, author) VALUES($1, $2)
        "#,
            literature.title,
            literature.author
        )
        .execute(connection)
        .await?;

        Ok(())
    }

    pub async fn list(connection: &PgPool, pagination: u32) -> Result<Vec<Literature>> {
        let limit = ((pagination + 1) * 24) - 1;

        let literatures = sqlx::query_as::<_, Literature>(
            r#"
            SELECT * FROM literature LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit)
        .bind(pagination)
        .fetch_all(connection)
        .await?;

        Ok(literatures)
    }

    pub async fn borrow(connection: &PgPool, uuid: Uuid, id: i32) -> Result<()> {
        sqlx::query!(
            r#"
            INSERT INTO borrow(account, literature) VALUES($1, $2)
        "#,
            uuid,
            id
        )
        .execute(connection)
        .await?;

        Ok(())
    }

    pub async fn list_borrow(connection: &PgPool, uuid: Uuid) -> Result<Vec<BorrowID>> {
        let borrowed = sqlx::query_as::<_, BorrowID>(
            r#"
            SELECT literature FROM borrow WHERE account = $1
        "#
        )
        .bind(uuid)
        .fetch_all(connection)
        .await?;

        Ok(borrowed)
    }
}
