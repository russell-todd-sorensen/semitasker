ad_page_contract {

    Query Writer One Object
    @author Tom Jackson <tom@junom.com>
    @creation-date 21 February 2002
    @cvs-id $Id: one.tcl,v 1.1 2002/02/22 09:26:53 nsadmin Exp $
} {
    object_id:trim,notnull
} -properties {
    title:onevalue
    context_bar:onevalue
    objects:multirow
}


if {![db_0or1row qw_object_qry "
select
 * 
from
 qw_objects
where
 object_id = :object_id" ]} {
    ad_return complaint 1 "Object $object_id not found"
}


set context_bar  [ad_context_bar_ws [list  "../index" "Query Writer Admin Index"] [list  "index" "Query Writer Objects Index"] "One Object: $object"]

set title "One Object: $object"
