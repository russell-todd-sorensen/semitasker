ad_page_contract {

    Query Writer Manage Function Attributes
    @author Tom Jackson <tom@junom.com>
    @creation-date 22 February 2002
    @cvs-id $Id: add.tcl,v 1.5 2002/02/24 19:24:43 nsadmin Exp $
} {
    fn_id:trim,notnull
} -properties {
    title:onevalue
    context_bar:onevalue
    attrs:multirow
}

if {![db_0or1row fn_qry "
select
 *
from
 qw_fns
where
 fn_id = :fn_id"]} {

    ad_return_complaint 1 "Function $fn_id not found"

} 

set attr_list [db_list attrs_query "select attr from qw_fn_attrs where fn_id = :fn_id"]

db_multirow all_attrs all_obj_attrs_qry "
select
 qa.attr,
 qa.default_value
from
 qw_attrs qa,
 qw_fns qf
where
 qf.fn_id = :fn_id
and
 qf.object_id = qa.object_id
order by qa.attr"

db_multirow attrs fn_attr_qry "
select
 *
from
 qw_fn_attrs
where
 fn_id = :fn_id
order by
 attr_order"

set context_bar  [ad_context_bar_ws [list  "../index" "Query Writer Index"] [list  "index" "Query Writer Function Attribute Index"] "Add Attribute for $name"]

set title "Manage Attributes for $name"