CREATE TABLE IF NOT EXISTS actions (
    hash TEXT PRIMARY KEY,
    height TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    from_address TEXT NOT NULL,
    to_address TEXT NOT NULL,
    memo TEXT NOT NULL,
    amounts JSONB NOT NULL
);