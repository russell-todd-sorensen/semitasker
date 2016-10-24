create function inline_0 () 
returns integer as '  
begin 
    PERFORM acs_object_type__create_type (  
  ''customer'', -- object_type  
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