ad_page_contract {

    Query Writer Add Object Attribute
    @author Tom Jackson <tom@junom.com>
    @creation-date 21 February 2002
    @cvs-id $Id: add.tcl,v 1.2 2002/03/19 03:59:18 nsadmin Exp $
} {
    object_id:trim,notnull
} -properties {
    title:onevalue
    context_bar:onevalue
    objects:multirow
}


set context_bar  [ad_context_bar_ws [list  "../index" "Query Writer Index"] [list  "index" "Query Writer Attribute Index"] "Add Attribute"]

set title "Add Object Attribute"

db_multirow attrs qw_object_attrs_qry "
select
 * 
from
 qw_attrs
where 
 object_id = :object_id
order by
 attr"

set return_url "[qw_this_url]?object_id=$object_id"