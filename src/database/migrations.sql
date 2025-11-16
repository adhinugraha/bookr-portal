CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    phone_number TEXT UNIQUE,
    password TEXT DEFAULT NULL,
    external_id INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS external_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id),
    token TEXT DEFAULT NULL,
    expires INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (
  email,
  phone_number,
  password
) VALUES (
  'john.doe@email.com',
  '08123456789',
  '$2b$10$eZ0k5tdW0p.chbpHrz/lluNfBGSkXgUAMLs4ahHxD3HhhfGW5YXY6', -- hashed 123456
);
