-- Add migration script here
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS account (
    id uuid PRIMARY KEY -- Insert maunally
);

CREATE TABLE IF NOT EXISTS borrow (
    id uuid DEFAULT uuid_generate_v4 (),
    account uuid,
    literature INTEGER NOT NULL,
    since TIMESTAMP WITHOUT TIME ZONE NOT NULL 
        DEFAULT (current_timestamp AT TIME ZONE 'UTC+7'),
    exceed TIMESTAMP WITHOUT TIME ZONE NOT NULL
        DEFAULT (current_timestamp AT TIME ZONE 'UTC+7') + INTERVAL '3 day' 
            CHECK (exceed > since),
    PRIMARY KEY(id, account)
);

CREATE TABLE IF NOT EXISTS literature (
    id SERIAL PRIMARY KEY,
    title varchar(100) NOT NULL,
    author varchar(100) NOT NULL
);

ALTER TABLE borrow
    ADD CONSTRAINT literature_key
        FOREIGN KEY(literature)
            REFERENCES literature(id);