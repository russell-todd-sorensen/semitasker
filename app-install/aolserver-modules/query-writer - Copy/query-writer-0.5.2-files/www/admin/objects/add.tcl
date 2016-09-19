ad_page_contract {

    Query Writer Add Object
    @author Tom Jackson <tom@junom.com>
    @creation-date 20 February 2002
    @cvs-id $Id: add.tcl,v 1.1 2002/02/22 09:26:53 nsadmin Exp $
} {

} -properties {
    title:onevalue
    context_bar:onevalue
    objects:multirow
}


set context_bar  [ad_context_bar_ws [list  "../index" "Query Writer Index"] [list "index" "Object Index"] "Add Object"]

set title "Add Object"

db_multirow objects qw_object_qry "
select
 * 
from
 qw_objects
order by
 object"

