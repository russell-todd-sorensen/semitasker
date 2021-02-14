ad_page_contract {

    Query Writer Admin Map Group Permissions
    @author Tom Jackson <tom@junom.com>
    @creation-date 21 February 2002
    @cvs-id $Id: perm-map.tcl,v 1.1 2002/02/22 09:29:52 nsadmin Exp $
} {
    object_id:notnull
    {group_id:integer "1"}
} -properties {
    title:onevalue
    context_bar:onevalue
}


if {![db_0or1row object_query "
select
 *
from
 qw_objects
where
 object_id = :object_id"]} {

    ad_return_complaint 1 "Object Not found $object_id"
		return -code return
		ad_return_template "/blank.adp"
}

if {![db_0or1row group_query "
select
 group_id,
 name as group_name 
from
 qw_groups
where
 group_id = :group_id"]} {
    ad_return_complaint 1 "Group Not found $group_id"
		return -code return
		ad_return_template "/blank.adp"
}

set sql "
select
 attr_id,
 object_id,
 attr,
 default_value,
 values
from
 qw_attrs
where
 object_id = :object_id
order by
 attr"


db_multirow attrs "qw_attrs_query" $sql

set context_bar  [ad_context_bar_ws [list "../index" "Query Writer Index"] [list "index" "Group Index"] "Map Group Permissions for $object to $group_name"]

set title "Query Writer Map Group Permissions for $object to $group_name"

set return_url [ad_quotehtml "/qw/admin/objects?object_id=$object_id"]

