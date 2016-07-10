--
-- @author: tom@rmadilo.com
-- @creation-date: 2002 September 8
-- @file: media-create.sql
--


create table un_media_types (
  media_type_id integer
   constraint medt_media_type_id_nn not null
   constraint medt_media_type_id_pk primary key,
  -- type/subtype as in MIME types. 
  type varchar(128)
   constraint medt_type_nn not null
   constraint medt_type_un unique,
  -- tail of filename, portion following last dot
  subtype varchar(128)
   constraint medt_subtype_nn not null,
  file_tail varchar(32)
   constraint medt_file_tail_nn not null,
  -- name of tcl handler
  -- is this possible or will rp_handler dominate?
  -- i'm thinking of things like a pdf handler that 
  -- understands byte ranges, etc.
  handler text,
  constraint medt_type_subtype_un unique (type,subtype)
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
   constraint med_media_type_id_fk references un_media_types,
  -- maps to the attachment point
  media_attribute_id integer
   constraint med_media_attribute_id_nn not null
   constraint med_media_attribute_id_fk references media_attributes,
  -- what object tag is the media attached to
  -- object tag can be any column of a table that can be represented
  -- with less than 100 characters. The column the object_tag_id
  -- comes from should be unique.
  object_tag_id varchar(100)
   constraint med_object_tag_id_nn not null,
  -- file_root if this isn't unique per object_tag_id could lead
  -- to problems.
  file_root varchar(256) 
   constraint med_file_root_nn not null,
  constraint med_obj_tag_file_root_un unique (object_tag_id,file_root),
  -- do I need title and description? 
  -- for bare minimum implimentation, 
  -- the media handler (::media::handler::type::create)
  -- should take care of adding/storing this and other attributes 
  -- corresponding to the media type
  title varchar(250),
  description text,
  -- to blob or not to blob ---
  -- handler should figure this out 
  blob_p char(1) 
   constraint med_blob_p_nn not null
   constraint med_blob_p_df default 'f'
   constraint med_blob_p_ck check (blob_p in ('t','f')),
  -- media contains content if blob_p = t
  media blob
);

create index media_obj_attr_idx on media (object_tag_id, media_attribute_id);

create table media_objects (
  media_object name
   not null
   primary key
   check (media_object in (select x from pg_class)),
  -- maximum size of media. default null means unlimited
  -- zero or negative values disable adding media without
  -- removing existing media. (admin override of course).
  object_tag_column name
   not null,
  max_size integer
   default null,
  -- description of the object
  description text
);

create table media_attributes (
  media_attribute_id integer
   not null
   primary key,
  media_attribute name
   not null,
  media_object name
   references media_objects,
  -- see comment for max_size in media_objects
  max_size integer
   default null,
  -- description of the attribute
  description text
  constraint medat_media_attributes_un unique (media_attribute, media_object)
);
  
-- should there be a mapping table?
-- maybe just put the media_attribute_id into media

create table media_map (
  media_map_id integer
   not null
   primary key
   refrences acs_objects(object_id),
  media_id integer
   not null
   references media,
  media_attribute_id integer
   not null
   references media_attributes
);