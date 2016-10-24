

-- Drop script for package
--
-- /packages/{package_name}/sql/postgresql/customer2-drop.sql
--
-- Drop 
--
-- @author ()
-- @creation-date ()
-- @cvs-id $Id$
--

select drop_package('cust3');
	
drop table customers;
drop table customer_types;

create function inline_0 () returns integer as '
begin
    PERFORM acs_object_type__drop_type (
     ''cust3'', ''f''
    );
    return null;
end;' language 'plpgsql';

select inline_0 ();

drop function inline_0 ();

