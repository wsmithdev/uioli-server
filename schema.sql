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


SELECT
  cards.user_id,
  a.bank_name,
  b.days
FROM cards
INNER JOIN banks a ON cards.bank_name_id = a.id
INNER JOIN usage_freq b ON cards.usage_freq_id = b.id;

SELECT 
            cards.id,
            cards.user_id,
            bank.bank_name,
            cards.usage_freq_id,
            freq.days,
           
            cards.last_used,
            cards.next_use

          FROM cards
        FULL OUTER JOIN banks bank ON cards.bank_name_id = bank.id
        FULL OUTER JOIN usage_freq freq ON cards.usage_freq_id = freq.id
          WHERE user_id = 1;