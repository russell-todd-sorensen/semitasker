\i test-table.sql
create function inline_0 () 
returns integer as '  
begin 
    PERFORM acs_object_type__create_type (  
  ''cust3'', -- object_type  
  '''', -- pretty_name 
  '''', -- pretty_plural 
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


create function customer3__customer3_p (integer)
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