--
-- @author: tom@rmadilo.com
-- @creation-date: 2003 June 20
-- @file: media-2-create.sql
--


create table media_types (
  media_type_id integer
   constraint medt_media_type_id_nn not null
   constraint medt_media_type_id_pk primary key,
  -- type/subtype as in MIME types. 
  type varchar(128)
   constraint medt_type_nn not null
   constraint medt_type_un unique,
  -- tail of filename, portion following last dot
  file_tail varchar(32)
   constraint medt_file_tail_nn not null,
  -- name of tcl handler
  -- is this possible or will rp_handler dominate?
  -- i'm thinking of things like a pdf handler that 
  -- understands byte ranges, etc.
  handler text
);

create table media (
  media_id integer
   constraint med_media_id_nn not null
   constraint med_media_id_pk primary key
   constraint med_media_id_fk references acs_objects(object_id),
  party_id integer
   constraint med_party_id_nn not null
   constraint med_party_id_fk references parties,
  media_type_id integer
   constraint med_media_type_id_nn not null
   constraint med_media_type_id_fk references media_types,
  -- maps to the attachment point
  anchor_id integer
   constraint med_anchor_id_nn not null
   constraint med_anchor_id_fk references media_anchors,
  row_id varchar(100)
   constraint med_row_id_nn not null,
  -- file_root if this isn't unique per row_id could lead
  -- to problems.
  file_root varchar(256) 
   constraint med_file_root_nn not null,
  constraint med_row_id_file_root_un unique (row_id,file_root)
);

create index media_row_anchor_idx on media (row_id, anchor_id);
 
create table media_anchor_tables (
  anchor_table name
   not null
   primary key
   check (anchor_table in (select x from pg_class)),
  row_id_column name
   not null,
  -- maximum size of media. default null means unlimited
  -- zero or negative values disable adding media without
  -- removing existing media. (admin override of course).
  max_size integer
   default null,
  -- description of the table
  description text
);

create table media_anchors (
  anchor_id integer
   not null
   primary key,
  anchor name
   not null,
  anchor_table name
   references media_anchor_tables,
  -- see comment for max_size in media_anchor_tables
  max_size integer
   default null,
  -- description of the anchor
  description text
  constraint medat_media_anchors_un unique (anchor, anchor_table)
);