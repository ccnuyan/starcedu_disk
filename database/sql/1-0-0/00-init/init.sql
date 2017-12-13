drop schema if exists starcedu_disk CASCADE;

create schema starcedu_disk;
set search_path = starcedu_disk;

create extension if not exists pgcrypto with schema starcedu_disk;