ad_page_contract {

    Query Writer Add Function Attribute
    @author Tom Jackson <tom@junom.com>
    @creation-date 22 February 2002
    @cvs-id $Id: edit-2.tcl,v 1.1 2002/02/23 12:14:45 nsadmin Exp $
} {
    fn_id:trim,notnull
    attr:trim,notnull
    {default_value:trim ""}
    attr_order:integer,notnull
    {return_url:trim "/"}
} -properties {
    title:onevalue
    context_bar:onevalue
}


set sql "
update
 qw_fn_attrs
set
 default_value = :default_value,
 attr_order = :attr_order
where
 fn_id = :fn_id
and
 attr = :attr"

db_dml "update_fn_attr_dml" $sql

ad_returnredirect $return_url
