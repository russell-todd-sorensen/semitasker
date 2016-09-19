ad_page_contract {

    Query Writer Admin Dump All Data
    @author Tom Jackson <tom@junom.com>
    @creation-date 27 February 2002
    @cvs-id $Id: dump-all.tcl,v 1.18 2002/03/17 01:27:48 nsadmin Exp $
} {
    {prefix:trim ""}
} -properties {
    title:onevalue
    context_bar:onevalue
}


proc escapeTcl { string } {

    set open_bracket {\[}
		set close_bracket {\]}
    set quote {\"} 
    set backslash {\\}
		regsub -all $open_bracket $string $open_bracket string
    regsub -all $close_bracket $string $close_bracket string
    regsub -all $quote $string $quote string
    return $string 

}

global object_id_list
set context_bar  [ad_context_bar_ws [list "../" "Query Writer Index"] "Dump All Data"]

set title "Query Writer Dump All Data"
set object_id_list [list]
set data ""

db_foreach groups_query "
select
 distinct(group_id)
from
 qw_group_attr_map 
where 
 object_id 
in
 (select 
   object_id 
  from
   qw_objects
  where
   obj_table like '${prefix}%'
 )" {

    db_1row qroup_data_query "
select
 *
from
 qw_groups
where
 group_id = :group_id"

		append data "catch {db_dml insert_group \"insert into qw_groups (group_id, name) values (
'$group_id','[DoubleApos $name]')\" } \n"


 }
   
db_foreach objects_query "
select
 * 
from
 qw_objects
where
 obj_table like '${prefix}%'" {

   append data "db_dml insert_qw_object \"insert into qw_objects (object_id,object,obj_table,key,
to_eval,set_perm_check,del_perm_check,ops,new_fn,set_fn,del_fn,rst_fn,
perm_p) values ('$object_id','$object','$obj_table','$key',
'[escapeTcl [DoubleApos $to_eval]]','$set_perm_check','$del_perm_check','$ops','$new_fn','$set_fn','$del_fn','$rst_fn',
'$perm_p')\"\n"


   db_foreach attr_query "
select
 *
from
 qw_attrs
where
 object_id = :object_id" {

     append data "db_dml insert_object_attr \"insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'$attr_id','$object_id','$attr',
'[DoubleApos $description]','[DoubleApos $default_value]',
'[DoubleApos $help_text]','[DoubleApos $filters]',
'[DoubleApos $values]','$length','$datatype')\"\n"



   }
   global object_id_list
   lappend object_id_list $object_id
 
 }

ns_log Notice "OOOobject_id_list: $object_id_list"

foreach object_id $object_id_list {
   db_foreach fn_query "
select
 * 
from
 qw_fns
where
 object_id = :object_id" {
  
		 append data "
set fn_id \[db_string fn_nextval \"select nextval('qw_fn_sequence')\"]

db_dml insert_qw_fn \"insert into qw_fns (fn_id,object_id,type,
name,description,joiner,active_p) values ('\$fn_id','$object_id',
'$type',
'[DoubleApos $name]','[DoubleApos $description]','$joiner',
'$active_p')\"\n" 
 
       db_foreach fn_attr_query "
select
 *
from
 qw_fn_attrs
where
 fn_id = :fn_id" {

       append data "db_dml insert_fn_attr \"insert into qw_fn_attrs (attr,fn_id,
default_value, attr_order) values ('$attr','\$fn_id', 
'[DoubleApos $default_value]','$attr_order')\"\n"


        }
       }

    # Map some group_privs
    db_foreach group_attr_map_query "
select 
 * 
from
 qw_group_attr_map 
where
object_id = :object_id" {
   
    append data "db_dml insert_qroup_attr_mapping \"insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('$group_id','$object_id','$attr_id',
'[DoubleApos $values]','$ops')\"\n"

    }
}

if {[string match "qw_" $prefix]} {

		# write file to disk
    set filename "[acs_package_root_dir query-writer]/tcl/query-writer-bootstrap.tcl.data"
    set file [open $filename w]
    catch {puts $file "\# cvs-id: \$Id\$ "}
    catch {puts $file $data}
    close $file
    ns_log Notice "query-writer/www/admin/dump/dump-all: dumped qw_ data. to '$filename'"
}

