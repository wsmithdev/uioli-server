CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  password TEXT NOT NULL,
  token_id INTEGER
);

CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  bank_name_id INTEGER NOT NULL,
  usage_freq_id INTEGER,
  notifications BOOLEAN DEFAULT true,
  last_used TEXT,
  next_use REAL,
  card_name TEXT
);

CREATE TABLE banks (
  id SERIAL PRIMARY KEY,
  bank_name TEXT NOT NULL,
);

CREATE TABLE usage_freq (
  id SERIAL PRIMARY KEY,
  days INTEGER NOT NULL
);


CREATE TABLE access_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER, 
  plaid_access_token TEXT
);

