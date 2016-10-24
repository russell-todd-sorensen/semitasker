create function inline_0 () 
returns integer as '  
begin 
    PERFORM acs_object_type__create_type (  
  ''customer6'', -- object_type  
  ''Customer'', -- pretty_name 
  ''Customers'', -- pretty_plural 
  ''acs_object'',   -- supertype 
  ''customers'', -- table_name 
  ''customer_id'', -- id_column 
  null, -- package_name 
  ''f'', -- abstract_p 
  null, -- type_extension_table 
  null -- name_method 
  ); 

     return 0;  
end;' language 'plpgsql'; 

select inline_0 (); 
 
drop function inline_0 ();
create or replace function customer6__customer6_p (integer)
returns boolean
as '
declare
 p_customer_id alias for $1;
 v_check_customer_id integer;
begin
 select count(customer_id) into v_check_customer_id
  from customers
  where customer_id = p_customer_id;
 if v_check_customer_id = 1 
 then 
   return true;
 else 
   return false;
 end if;
end;' language 'plpgsql';

 
create or replace function customer6__new (integer, integer, character varying, character varying) 
returns integer as ' 
declare 
  p_customer_id alias for $1; -- default 
  p_cust_type alias for $2; -- default 1
  p_cust_name alias for $3; -- default 
  p_cust_external_id alias for $4; -- default 
  p_context_id acs_objects.context_id%TYPE = null;
  p_creation_date acs_objects.creation_date%TYPE = null;
  p_creation_user acs_objects.creation_user%TYPE = null;
  p_creation_ip acs_objects.creation_ip%TYPE = null;
  p_security_inherit_p acs_objects.security_inherit_p%TYPE = true;
  p_title acs_objects.title%TYPE = null;
  p_package_id acs_objects.package_id%TYPE = null; 
  v_customer_id customers.customer_id%TYPE;
begin 
  v_customer_id := acs_object__new (  
    p_customer_id,  
    ''customer6'',  --p_object_type, 
    p_creation_date, 
    p_creation_user, 
    p_creation_ip, 
    p_context_id,
    p_security_inherit_p,
    p_title,
    p_package_id
  );   
  
  insert into customers 
    (customer_id, cust_type, cust_name, cust_external_id) 
  values
    (v_customer_id, p_cust_type, p_cust_name, p_cust_external_id);

  return v_customer_id;

end;' language 'plpgsql';

 
create or replace function customer6__new (integer, integer, character varying, character varying, integer, character varying) 
returns integer as ' 
declare 
  p_customer_id alias for $1; -- default 
  p_cust_type alias for $2; -- default 1
  p_cust_name alias for $3; -- default 
  p_cust_external_id alias for $4; -- default 
  p_context_id alias for $5; -- default null
  p_creation_ip alias for $6; -- default null
  p_creation_date acs_objects.creation_date%TYPE = null;
  p_creation_user acs_objects.creation_user%TYPE = null;
  p_security_inherit_p acs_objects.security_inherit_p%TYPE = true;
  p_title acs_objects.title%TYPE = null;
  p_package_id acs_objects.package_id%TYPE = null; 
  v_customer_id customers.customer_id%TYPE;
begin 
  v_customer_id := acs_object__new (  
    p_customer_id,  
    ''customer6'',  --p_object_type, 
    p_creation_date, 
    p_creation_user, 
    p_creation_ip, 
    p_context_id,
    p_security_inherit_p,
    p_title,
    p_package_id
  );   
  
  insert into customers 
    (customer_id, cust_type, cust_name, cust_external_id) 
  values
    (v_customer_id, p_cust_type, p_cust_name, p_cust_external_id);

  return v_customer_id;

end;' language 'plpgsql';

create or replace function customer6__set_attrs (integer, character varying, character varying, integer, character varying)   
returns integer as ' 
declare 
  p_customer_id alias for $1; -- default 
  p_cust_name alias for $2; -- default 
  p_cust_external_id alias for $3; -- default 
  p_modifying_user alias for $4; -- default null
  p_modifying_ip alias for $5; -- default null
  p_last_modified acs_objects.last_modified%TYPE = null; 
  v_return integer := 0; 
begin  
  if not customer6__customer6_p(p_customer_id)
   then 
    return v_return; 
  end if; 

  if p_cust_name is not null
  then
   update customers set cust_name = p_cust_name
    where customer_id = p_customer_id;
  end if;

  if p_cust_external_id is not null
  then
   update customers set cust_external_id = p_cust_external_id
    where customer_id = p_customer_id;
  end if;

  v_return := acs_object__update_last_modified(
   p_customer_id,
   p_modifying_user,
   p_modifying_ip,
   p_last_modified
  );
  
  return v_return;
end;' language 'plpgsql';



create or replace function customer6__delete (integer) 
returns integer as ' 
declare 
 p_customer_id    alias for $1; 
 v_return integer := 0;  
begin 
if not customer6__customer6_p(p_customer_id)
   then 
    return v_return; 
   end if; 
   delete from acs_permissions 
     where object_id = p_customer_id; 

   delete from customers 
     where customer_id = p_customer_id;
   delete from acs_objects
     where object_id = p_customer_id;

   raise NOTICE ''Deleting customer6...'';

   return v_return;

end;' language 'plpgsql';

  
create or replace function customer6__set_attrs (integer, character varying, character varying)   
returns integer as ' 
declare 
  p_customer_id alias for $1; -- default
  p_cust_name alias for $2; -- default
  p_cust_external_id alias for $3; -- default
  p_last_modified acs_objects.last_modified%TYPE = null;
  p_modifying_user acs_objects.modifying_user%TYPE = null;
  p_modifying_ip acs_objects.modifying_ip%TYPE = null;
  v_return integer := 0;
begin  
  if not customer6__customer6_p(p_customer_id)
   then 
    return v_return; 
  end if; 

  if p_cust_name is not null
  then
   update customers set cust_name = p_cust_name
    where customer_id = p_customer_id;
  end if;

  if p_cust_external_id is not null
  then
   update customers set cust_external_id = p_cust_external_id
    where customer_id = p_customer_id;
  end if;

  v_return := acs_object__update_last_modified(
   p_customer_id,
   p_modifying_user,
   p_modifying_ip,
   p_last_modified
  );
  
  return v_return;
end;' language 'plpgsql';

select customer6__new(null,1,'Russell Sorensen','353159',671,'192.168.1.20');