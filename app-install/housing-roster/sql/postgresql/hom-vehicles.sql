create table hom_vehicles (
  vehicle_id integer not null primary key,
  hom_id varchar(15) not null unique,
  vehicle_description varchar(127) not null,
  vehicle_color varchar(31) not null default 'unavailable',
  vehicle_license varchar(31) not null,
  vehicle_location varchar(31) not null,
  vehicle_vin varchar(63) not null,
  vehicle_year char(4) not null,
  vehicle_make varchar(31) not null,
  vehicle_model varchar(31) not null,
  vehicle_reg_expiration date not null,
  vehicle_total_fees numeric(5,2) not null default 0.00
);

create table hom_service_types (
  service_type_id integer not null primary key,
  service_type_name varchar(31) not null unique,
  service_type_descr varchar(1023) not null,
  service_documents varchar(1023) default null,
  service_interval integer not null default 3
);

insert into hom_service_types values 
(1,'Three Month Inspection','Three month vehicle inspection.',null,3),
(2,'Six Month Inspection','Six month vehicle inspection.',null,6),
(3,'Yearly Inspection','Yearly vehicle inspection',null,12),
(4,'25,000 Mile Inspection','25,000 mile vehicle inspection',null,0),
(5,'30,000 Mile Inspection','30,000 mile vehicle inspection',null,0),
(6,'50,000 Mile Inspection','50,000 mile vehicle inspection',null,0),
(7,'60,000 Mile Inspection','60,000 mile vehicle inspection',null,0),
(8,'75,000 Mile Inspection','75,000 mile vehicle inspection',null,0),
(9,'90,000 Mile Inspection','90,000 mile vehicle inspection',null,0),
(10,'100,000 Mile Inspection','100,000 mile vehicle inspection',null,0),
(11,'120,000 Mile Inspection','120,000 mile vehicle inspection',null,0),
(12,'125,000 Mile Inspection','125,000 mile vehicle inspection',null,0),
(13,'150,000 Mile Inspection','150,000 mile vehicle inspection',null,0);

create table hom_vehicle_service_schedule (
  vehicle_id integer not null references hom_vehicles(vehicle_id),
  service_type_id integer not null references hom_service_types(service_type_id),
  active_p boolean not null default true,
  CONSTRAINT hvss_veh_serv_type_pk primary key (vehicle_id, service_type_id)
);

insert into hom_vehicle_service_schedule values 
(2,1,true),
(2,2,true),
(2,3,true),
(2,5,true),
(2,7,true),
(5,1,true),
(5,3,true),
(5,4,true),
(5,6,true),
(5,8,true),
(5,10,true),
(5,12,true),
(5,13,true);

-- add all vehicles to three month service
insert into hom_vehicle_service_schedule (vehicle_id,service_type_id) values
(3,1),
(4,1),
(6,1),
(7,1),
(9,1),
(10,1),
(11,1),
(12,1),
(14,1),
(16,1);



create table hom_vehicle_service_log (
  service_id integer not null primary key,
  vehicle_id integer not null references hom_vehicles(vehicle_id),
  service_type_id integer not null default 1 references hom_service_types(service_type_id),
  service_date date not null default now()::date,
  vehicle_odometer numeric(10,1) not null default 0.0,
  service_notes text
);
  
