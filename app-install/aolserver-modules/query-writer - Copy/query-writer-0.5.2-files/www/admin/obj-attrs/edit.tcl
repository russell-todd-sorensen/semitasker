ad_page_contract {

    Query Writer Edit Object Attribute
    @author Tom Jackson <tom@junom.com>
    @creation-date 22 February 2002
    @cvs-id $Id: edit.tcl,v 1.1 2002/02/22 10:25:33 nsadmin Exp $
} {
    object_id:trim,notnull
    attr_id:trim,notnull
} -properties {
    title:onevalue
    context_bar:onevalue
}


set context_bar  [ad_context_bar_ws [list  "../index" "Query Writer Index"] [list  "index" "Query Writer Attribute Index"] "Add Attribute"]

set title "Add Object Attribute"

if {![db_0or1row qw_attr_query "
select
 * 
from
 qw_attrs
where 
 object_id = :object_id
and
 attr_id = :attr_id"] } {
    ad_return_complaint 1 "Attribute $attr_id for object $object_id not found."
}



