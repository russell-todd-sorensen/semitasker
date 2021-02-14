ad_page_contract {

    Query Writer Add Object Attribute Page 2
    @author Tom Jackson <tom@junom.com>
    @creation-date 21 February 2002
    @cvs-id $Id: add-2.tcl,v 1.2 2002/03/17 01:19:29 nsadmin Exp $
} {

    object_id:trim,notnull
    attr_id:trim,notnull
    attr:trim,notnull
    datatype:trim,notnull
    {filters:trim ""}
    {values:trim ""}
    {default_value:trim ""}
    {length:trim ""}
    {description:trim ""}
    {help_text:trim ""}

} 


set sql "
insert into
 qw_attrs
 (
 attr_id,
 object_id,
 attr,
 description,
 default_value,
 help_text,
 filters,
 values,
 length,
 datatype
 )
values 
 (
 :attr_id,
 :object_id,
 :attr,
 :description,
 :default_value,
 :help_text,
 :filters,
 :values,
 :length,
 :datatype
) "

db_dml "insert_object_attr" $sql

ad_returnredirect "add?object_id=$object_id"