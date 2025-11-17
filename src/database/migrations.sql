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

CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    image TEXT DEFAULT NULL,
    external_id INTEGER DEFAULT 0,
    status INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO classes (
  name,
  description,
  image,
  external_id,
  status
) VALUES [(
  'Relaxing Full Body Massage',
  'A gentle, soothing full-body massage designed to relax the entire body.',
  'https://example.com/images/massage-fullbody.png',
  7001,
  1
),(
  'Deep Tissue Massage',
  'A firm pressure massage focused on deep muscle layers to relieve tension.',
  'https://example.com/images/massage-deeptissue.png',
  7002,
  1
),(
  'Aromatherapy Massage',
  'Massage using essential oils to enhance relaxation and reduce stress.',
  'https://example.com/images/massage-aroma.png',
  7003,
  1
)];

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    external_id INTEGER DEFAULT 0,
    class_id UUID REFERENCES classes(id),
    schedule_id INTEGER DEFAULT 0,
    status INTEGER DEFAULT 0,
    paid INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount INTEGER DEFAULT 0,
    payment_ref_id TEXT DEFAULT NULL,
    payment_req_id TEXT DEFAULT NULL,
    payment_prefix TEXT DEFAULT NULL,  -- "CARDS-VISA-1234" -- from "channel_code" + "network" + "masked_card_number"
    issuer TEXT DEFAULT NULL,
    status INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NULL,
    issued_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT DEFAULT NULL,
    user_id UUID REFERENCES users(id),
    booking_id UUID UNIQUE REFERENCES bookings(id),
    payment_id UUID UNIQUE REFERENCES payments(id),
    amount INTEGER DEFAULT 0,
    status INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NULL,
    issued_at TIMESTAMP DEFAULT NULL
);
