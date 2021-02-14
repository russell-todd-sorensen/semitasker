-- qw-groups-create.sql

-- Create Query Writer Groups Data Model
--
-- @author Tom Jackson (tom@junom.com)
-- @creation-date 28 January 2002
-- @cvs-id $Id: qw-groups-create.sql,v 1.4 2002/02/09 22:39:22 nsadmin Exp $
--


create table qw_groups (
  group_id integer
   constraint qwg_group_id_nn not null
   constraint qwg_group_id_pk primary key,
  name varchar(100) 
   constraint qwg_name_nn not null
   constraint qwg_name_un unique
);

comment on table qw_groups is '
  A query writer group is the main security mechanism
that allows or denies a given user the right to use the
query writer. A separate function or tcl procedure will
be used to place users into a single group. A simple 
implimentation of this procedure would be to place 
users with admin priviliges into an admin group, and
to place all other users into a default group. Users will
never see this group_id, and it will never be passed around
in form variables. The group will also determine which UI 
components to display, if UI switches are used. A UI switch
name can be determined from an object_id.attr_id.value name.
For product.state.0, the UI switch product_state_0_p would
be set to either 0 or 1.
';

create table qw_group_attr_map (
 group_id integer 
  constraint gam_group_id_nn not null
  constraint gam_group_id_fk references qw_groups,
 object_id varchar(100)
  constraint gam_object_id_nn not null,
 attr_id varchar(100) 
  constraint gam_attr_id_nn not null,
 values varchar(1000),
 ops varchar(100),
 constraint gam_table_pk primary key (group_id,object_id,attr_id)
);


