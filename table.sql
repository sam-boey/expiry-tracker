CREATE TABLE IF NOT EXISTS items (
   id SERIAL PRIMARY KEY,
   name TEXT,
   ed DATE,
   picture TEXT,
   user_id INTEGER,
   FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
   username TEXT,
   password TEXT
);