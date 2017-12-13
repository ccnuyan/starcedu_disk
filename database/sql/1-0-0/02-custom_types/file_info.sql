set search_path = starcedu_disk;

CREATE TYPE crud_file_info AS(
  id BIGINT,
  uploader_id BIGINT,
  title VARCHAR,
  filename VARCHAR,
  etag VARCHAR,
  mime VARCHAR,
  size INTEGER,
  uploaded_at TIMESTAMPTZ,
  file_status INTEGER,
  success BOOLEAN,
  message VARCHAR
);