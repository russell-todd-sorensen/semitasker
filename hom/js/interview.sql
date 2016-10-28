drop table hom_applicant_interview;
drop sequence public.hom_applicant_interview_seq;
CREATE SEQUENCE public.hom_applicant_interview_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE public.hom_applicant_interview_seq
  OWNER TO postgres;

create table hom_applicant_interview (
  interview_id integer not null primary key default nextval('hom_applicant_interview_seq'),
  applicant_name varchar(63) not null,
  doc varchar(63) not null default 'N/A',
  date_of_interview date not null default '2000-01-01',
  time_of_interview time not null default '00:00:00',
  location varchar(63) not null,
  county_applied_for varchar(63) not null default 'King',
  out_of_county varchar(7) not null,
  level varchar(7) not null,
  isrb_releasable varchar(15) not null,
  age integer not null check (age > 17),
  time_in_prison varchar(63) not null,
  criminal_history varchar(1023) not null,
  drug_alcohol_use varchar(511) not null,
  clean_days varchar(127) not null,
  sotp_required varchar(7) not null,
  infraction_history varchar(1023) not null,
  triggers varchar(1023) not null,
  avoiding_triggers varchar(1023) not null,
  travel varchar(511) not null,
  pay_method varchar(127) not null,
  photos varchar(7) not null,
  program_stipulations varchar(7) not null,
  mandatory_meetings varchar(7) not null,
  curfew varchar(63) not null,
  shared_rooms varchar(7) not null,
  house_leaders varchar(7) not null,
  approved varchar(7) not null,
  housing_roster varchar(7) not null,
  point_of_contact varchar(7) not null,
  counselor varchar(127) not null,
  counselor_phone varchar(63) not null,
  counselor_email varchar(63) not null,
  confirmation_email varchar(7) not null,
  finalize varchar(7) default null
);

  
  
  
  
  