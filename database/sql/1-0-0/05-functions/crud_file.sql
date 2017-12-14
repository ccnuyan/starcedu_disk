set search_path = starcedu_disk;

CREATE OR REPLACE FUNCTION generate_file_crud_result(
  file starcedu_disk.files,
  success BOOLEAN,
  message VARCHAR)
RETURNS starcedu_disk.crud_file_info
as $$
BEGIN
  SET search_path=starcedu_disk;
  return (
    file.id,
    file.uploader_id, 
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
  INSERT INTO files(uploader_id, filename)
  VALUES (uid, filename)
  RETURNING * INTO new_file;
  success := TRUE;
  return_message := 'New file created';
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