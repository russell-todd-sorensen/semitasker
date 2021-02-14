ad_page_contract {

    Query Writer Admin Update Group Permissions
    @author Tom Jackson <tom@junom.com>
    @creation-date 25 March 2002
    @cvs-id $Id: perm-update.tcl,v 1.1 2002/04/01 18:50:53 stellar2 Exp $
} {
    object_id:notnull
    {group_id:integer "1"}
} -properties {
    title:onevalue
    context_bar:onevalue
}



set sql "
select
 a.attr_id,
 a.object_id,
 a.attr,
 a.default_value,
 m.values as values,
 m.group_id as group_id,
 m.ops as ops
from
 qw_attrs a,
 qw_group_attr_map m
where
 m.object_id = :object_id
and
 a.attr_id = m.attr_id
and
 a.object_id = m.object_id 
order by
 m.group_id , a.attr"

db_multirow perms object_perms_query $sql


set context_bar  [ad_context_bar_ws [list "../index" "Query Writer Index"] [list "index" "Group Index"] "Update Group Permissions for $object_id"]

set title "Query Writer Update Group Permissions for $object_id "

set return_url  "/qw/admin/objects/one?object_id=$object_id"

