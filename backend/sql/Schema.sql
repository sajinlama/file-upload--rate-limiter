CREATE TABLE users (
    user_id    SERIAL PRIMARY KEY,
    full_name  VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_user_id ON users (user_id);

CREATE TABLE image_url (
    id          SERIAL PRIMARY KEY,
    image_url   VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id     INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_image_url_user_id ON image_url (user_id);