set search_path = starcedu_disk;
drop schema if exists starcedu_disk CASCADE;

create schema starcedu_disk;
set search_path = starcedu_disk;

create extension if not exists pgcrypto with schema starcedu_disk;
set search_path = starcedu_disk;

create sequence id_sequence;

create or replace function id_generator(out new_id bigint)
as $$
DECLARE
  our_epoch bigint := 1483200000000; -- 2017/05/01
  seq_id bigint;
  now_ms bigint;
  shard_id int := 1;
BEGIN
  SET search_path = starcedu_disk;
  SELECT nextval('id_sequence') %1024 INTO seq_id;
  SELECT FLOOR(EXTRACT(EPOCH FROM now()) * 1000) INTO now_ms;
  new_id := (now_ms - our_epoch) << 23;
  new_id := new_id | (shard_id << 10);
  new_id := new_id | (seq_id);
END;
$$
LANGUAGE PLPGSQL;


set search_path = starcedu_disk;

create or replace function random_string(len int default 36)
returns text
as $$
select upper(substring(md5(random()::text), 0, len+1));
$$ 
language sql;

set search_path = starcedu_disk;

CREATE TYPE crud_file_info AS(
  id BIGINT,
  uploader_id BIGINT,
  uploader_email VARCHAR,
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
create table files(
  id bigint primary key not null default id_generator(),
  uploader_id bigint NOT NULL,
  filename varchar(256) NOT NULL,
  title varchar(256),
  etag varchar(256),
  mime varchar(256),
  size integer,
  uploaded_at timestamptz default now() not null,
  status integer default 0 -- 0:luanched, 1:uploaded, -1 removed
);
set search_path = starcedu_disk;

CREATE OR REPLACE FUNCTION generate_file_crud_result(
  file starcedu_disk.files,
  success BOOLEAN,
  message VARCHAR)
RETURNS starcedu_disk.crud_file_info
as $$
DECLARE
  uploader_email varchar;
BEGIN
  SET search_path=starcedu_disk;
  SELECT username FROM users WHERE id = file.uploader_id into uploader_email;
  return (
    file.id,
    file.uploader_id, 
    uploader_email, 
    file.title, 
    file.filename,
    file.etag,
    file.mime,
    file.size,
    file.uploaded_at,
    file.status,
    success, 
    message
  )::starcedu_disk.crud_file_info;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION create_file(
  uid BIGINT, -- username
  filename VARCHAR(256)) --content
RETURNS starcedu_disk.crud_file_info
as $$
DECLARE
  new_file starcedu_disk.files;
  success BOOLEAN;
  return_message VARCHAR(64);
BEGIN
  SET search_path=starcedu_disk;
    
  IF EXISTS (SELECT users.id FROM users WHERE users.id = uid)
  THEN
    INSERT INTO files(uploader_id, filename)
    VALUES (uid, filename)
    RETURNING * INTO new_file;
    success := TRUE;
    return_message := 'New file created';
  ELSE
    success := FALSE;
    SELECT 'This user does not exist' INTO return_message;
  END IF;
  return starcedu_disk.generate_file_crud_result(new_file, success, return_message);
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION require_file(fid BIGINT)
RETURNS starcedu_disk.crud_file_info
as $$
DECLARE
  require_file starcedu_disk.files;
  success BOOLEAN;
  return_message VARCHAR(64);
BEGIN
  SET search_path=starcedu_disk;

  SELECT * FROM files WHERE id = fid into require_file;

  IF require_file.id IS NOT NULL
  THEN
    success := TRUE;
    return_message := 'Required file found';
  ELSE
    success := FALSE;
    select 'This file does not exist' INTO return_message;
  END IF;
  return starcedu_disk.generate_file_crud_result(require_file, success, return_message);
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION update_file_title(
  uid BIGINT, -- username
  fid BIGINT, -- fileid
  tt VARCHAR(256))
RETURNS starcedu_disk.crud_file_info
as $$
DECLARE
  update_file starcedu_disk.files;
  success BOOLEAN;
  return_message VARCHAR(64);
BEGIN
  SET search_path=starcedu_disk;

  IF EXISTS (SELECT id FROM files WHERE id = fid and uploader_id = uid)
  THEN
    UPDATE files SET title = tt 
    WHERE id = fid;

    SELECT * FROM files WHERE id = fid AND uploader_id = uid INTO update_file;
    success := TRUE;
    return_message := 'File updated';
  ELSE
    success := FALSE;
    select 'The file created by this uploader does not exist' INTO return_message;
  END IF;
  return starcedu_disk.generate_file_crud_result(update_file, success, return_message);
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION update_file_status(
  fid BIGINT, -- fileid
  et VARCHAR,
  mm VARCHAR,
  sz INTEGER)
RETURNS starcedu_disk.crud_file_info
as $$
DECLARE
  update_file starcedu_disk.files;
  success BOOLEAN;
  return_message VARCHAR(64);
BEGIN
  SET search_path=starcedu_disk;

  IF EXISTS (SELECT id FROM files WHERE id = fid)
  THEN
    UPDATE files SET size=sz, etag=et, mime=mm, uploaded_at=now(), status=1
    WHERE id = fid;

    SELECT * FROM files WHERE id = fid INTO update_file;
    success := TRUE;
    return_message := 'File updated';
  ELSE
    success := FALSE;
    select 'The file created by this uploader does not exist' INTO return_message;
  END IF;
  return starcedu_disk.generate_file_crud_result(update_file, success, return_message);
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION delete_file(
  uid BIGINT, -- username
  fid BIGINT) -- fileid
RETURNS starcedu_disk.crud_file_info
as $$
DECLARE
  deleted_file starcedu_disk.files;
  success BOOLEAN;
  return_message VARCHAR(64);
BEGIN
  SET search_path=starcedu_disk;

  IF EXISTS (SELECT * FROM files WHERE files.id = fid and files.uploader_id = uid)
  THEN
    DELETE FROM files
    WHERE files.id = fid
    RETURNING * INTO deleted_file;
    success := TRUE;
    return_message := 'File deleted';
  ELSE
    success := FALSE;
    SELECT 'The file created by this uploader does not exist' INTO return_message;
  END IF;

  return starcedu_disk.generate_file_crud_result(deleted_file, success, return_message);
END;
$$
LANGUAGE PLPGSQL;
set search_path = starcedu_disk;
select 'Schema initialized' as result;