create table hom_address_types (
  type_id integer not null primary key,
  type_name varchar(63) not null unique,
  type_descr varchar(127) not null
);

insert into hom_address_types values 
(1,'Physical Address','Street address'),
(2,'Delivery Address','Address where deliveries can be made'),
(3,'Postal Address','Address where mail is delivered'),
(4,'Owner Address','Address of owner of property');

create table hom_addresses (
  address_id integer not null primary key,
  address_type_id integer not null REFERENCS hom_address_types(type_id) default 1,
  addr1 varchar(127),
  addr2 varchar(127),
  addr3 varchar(127),
  city  varchar(127),
  state char(2) not null default 'WA',
  postal_code char(10) not null,
  country_iso char(2) not null default 'US' REFERENCES countries(iso)
);

create table hom_houses (
  house_id integer not null primary key,
  house_name varchar(127) not null unique,
  address_id integer not null REFERENCES hom_addresses(address_id)
);

create table hom_applicant_states (
  state_id integer not null primary key,
  state varchar(63) not null unique,
  state_descr varchar(1027) not null
);

insert into hom_applicant_states values
(0,'initial','New applicant');

create table hom_applicant_state_transitions (
  from_state integer not null REFERENCES hom_applicant_states(state_id),
  to_state integer not null REFERENCES hom_applicant_states(state_id),
  transition_name varchar(127) not null,
  transition_descr varchar(1023) not null,
  CONSTRAINT hom_app_state_trans_pk PRIMARY KEY (from_state, to_state)
);
  
create table hom_entity_types (
  entity_type_id integer not null primary key,
  entity_type_name varchar(127) not null unique,
  entity_type_descr varchar(1023) not null
  );

insert into hom_entity_types values 
(1,'CCO','Officer Washington State Department of Corrections'),
(2,'SOTP','SOTP Therapist with DOC'),
(3,'Property Owner','Owner of property rented by HOM')
-- counselor, 
;
 
create table hom_external_entity (
  entity_id integer not null primary key 
   CONSTRAINT homee_entity_id_fk REFERENCES acs_objects(object_id),
  entity_type_id integer not null 
   CONSTRAINT homee_entity_type_id_fk REFERENCES hom_entity_types(entity_type_id),
  entity_name varchar(63) not null UNIQUE
  );
  
  
  
create table hom_applicant (
  applicant_id integer not null primary key
   constraint homa_applicant_id_fk REFERENCES acs_objects(object_id),
  firstname varchar(255) not null,
  lastname varchar(255) not null,
  -- Following fields are tracked more completely in additional tables
  external_id varchar(127) not null default '0',
  state_id integer not null default 0 references hom_applicant_states(state_id),
  active_p boolean not null default 't',
  house_id integer not null references hom_houses(house_id),
  start_date date not null default now(),
  end_date date default null,
  quickbooks_list_id varchar(127) default null

);

create table hom_applicant_house_map (
  applicant_id integer not null references hom_applicant(applicant_id),
  house_id integer not null references hom_houses(house_id),
  from_date timestamp with time zone not null default now(),
  until_date timestamp with time zone not null default '9999-12-31'
);

create table hom_applicant_state_journal (
  applicant_id integer not null references hom_applicant(applicant_id),
  applicant_state integer not null REFERENCES hom_applicant_states(state_id),
  from_date timestamp with time zone not null default now(),
  until_date timestamp with time zone not null default '9999-12-31'
);

create table hom_external_id_types (
  type_id integer not null primary key,
  type_name varchar(127) not null unique,
  type_descr varchar(1027) not null,
  type_pattern varchar(127) not null
);
  
insert into hom_external_id_types values
(1,'DOC','Washington State DOC Offerder Id','[1-9][0-9]{5}'),
(2,'NONE','Participant with no id','[0]'),
(3,'FED','US Federal Offender Id','[0-9-]+'),
(4,'SSN','Social Security Number','[1-9][0-9]{2}-[0-9]{2}-[0-9]{4}');

-- note that this is a mapping table
create table hom_external_ids (
  applicant_id integer not null references hom_applicant(applicant_id),
  type_id integer not null default 1 references hom_external_id_types(type_id),
  external_id varchar(127) not null,
  constraint home_external_ids_pk primary key (applicant_id,type_id)
);
