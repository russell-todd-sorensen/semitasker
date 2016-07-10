--
-- data model for nsjabber-db
-- @cvs-id $Id: dm.sql,v 1.2 2001/09/23 18:08:41 nsadmin Exp $
--
create table jab_groupchat (
 time timestamp default 'now',
 group_name varchar(255) not null,
 server varchar(255) not null, 
 resource varchar(255), 
 message_to varchar(1000) not null, 
 subject text, 
 body text); 

create table jab_chat (
 time timestamp default 'now',
 from_user varchar(255) not null,
 from_server varchar(255) not null,
 from_resource varchar(255),
 to_user varchar(255) not null,
 to_server varchar(255) not null,
 to_resource varchar(255),
 subject text,
 body text
);
