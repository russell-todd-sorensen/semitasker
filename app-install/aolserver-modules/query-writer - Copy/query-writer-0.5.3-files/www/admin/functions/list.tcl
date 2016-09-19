ad_page_contract {

    Query Writer Add Object Function
    @author Tom Jackson <tom@junom.com>
    @creation-date 22 February 2002
    @cvs-id $Id: list.tcl,v 1.2 2002/02/24 00:57:31 nsadmin Exp $
} {

} -properties {
    title:onevalue
    context_bar:onevalue
    functions:multirow
}


set context_bar  [ad_context_bar_ws [list  "../index" "Query Writer Index"] [list  "index" "Query Writer Function Index"] "List Functions"]

set title "List Functions"

db_multirow functions qw_obj_functions_qry "
select
 qo.*,
 qwf.*,
 ft.name as type_name,
 ft.description as type_description 
from
 qw_objects qo,
 qw_fns qwf,
 qw_fn_types ft
where
 qo.object_id = qwf.object_id
and
 qwf.type = ft.type
order by
 qwf.object_id,
 qwf.name"

