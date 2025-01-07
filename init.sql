CREATE TABLE IF NOT EXISTS corn_log (
    id SERIAL PRIMARY KEY,
    query_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip TEXT,
    success BOOLEAN
);

CREATE INDEX idx_query_time ON corn_log (query_time);