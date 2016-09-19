ad_page_contract {

    Query Writer Add Attributes Page 1
    @author Tom Jackson <tom@junom.com>
    @creation-date 2003 July 21
    @cvs-id $Id: wizard-2.tcl,v 1.1 2003/07/28 21:51:21 tom Exp $
} {
    object_id:trim,notnull
}

set title "Object Wizard Step 2: Add Attributes"
set context_bar ""

# get starting table name, object from object_id

db_1row table_info "select obj_table as table, object from qw_objects where object_id = :object_id"


proc qw_first_trigger { parent_table arglist } {

    upvar $arglist ARGS
    if {![db_0or1row first_trigger_query "
select 
 class.oid as table_oid,
 trig.tgargs
from
 pg_class class,
 pg_trigger trig
where
 class.relname = :parent_table and
 trig.tgtype = 21 and 
 class.relfilenode = trig.tgrelid
limit 1 "]} {
        set ARGS [list]
        return "0"
    }
    set index 0
    set count 1
    set ARGS [list]
    set nextbreak [string first {\000} $tgargs $index]
    while {$nextbreak > -1} {
        
        lappend ARGS [string range $tgargs $index [expr $nextbreak -1]]
        set index [expr $nextbreak + 4]
        set nextbreak [string first {\000} $tgargs $index]
        incr count
    }
    return $table_oid
}
   
proc qw_trigger_data { relfilenode argList } {

    upvar $argList ARGS
    if {![db_0or1row first_trigger_query "
select 
 trig.tgargs
from
 pg_trigger trig
where
 trig.tgtype = 21 and 
 trig.tgrelid = :relfilenode
limit 1 "]} {
        set ARGS [list]
        return "0"
    }
    set index 0
    set count 1
    set ARGS [list]
    set nextbreak [string first {\000} $tgargs $index]
    while {$nextbreak > -1} {
        
        lappend ARGS [string range $tgargs $index [expr $nextbreak -1]]
        set index [expr $nextbreak + 4]
        set nextbreak [string first {\000} $tgargs $index]
        incr count
    }
    return "1"
}

proc qw_table_data { tableName listVar } {

    upvar $listVar LIST
    if {![db_0or1row table_data "
select
 c.oid as table_oid,
 c.relfilenode as relfilenode
from
 pg_class c
where
 c.relname = :tableName"]} {
	set LIST [list]
	return "0"
    } else {
	lappend LIST $table_oid $relfilenode
	return "$table_oid"
    }
 
    
}  

proc qw_primary_keys { table_oid keyList } {

    upvar "$keyList" "LIST"

    if {![db_0or1row index_qry "
select
 indexrelid,
 indrelid,
 indkey,
 indclass,
 indisunique,
 indisprimary,
 indreference
from
 pg_index
where
 indrelid = :table_oid
and
 indisprimary = 't'" ]} {
	set LIST [list]
	return "0"
    }
    set attr_index [split $indkey]
    foreach index  $attr_index {
	lappend LIST [db_string attr_name "
select
 attname 
from 
 pg_attribute a
where
 a.attrelid = :table_oid
and
 a.attnum = :index"]
    }
	
    return [llength $LIST]
}

#
set parent_table $table
append tables "$parent_table "
set required_attributes 0

set available_filters [lsort [string map {ad_page_contract_filter_proc_ ""} [info commands ad_page_contract_filter_proc_*]]]
ns_log Notice "Available filters $available_filters"
while {1} {
    
    set tableData [list]
    if {![qw_table_data $parent_table tableData]} {
	break
    } 
    set table_oid [lindex $tableData 0]
    set relfilenode [lindex $tableData 1]
    
    db_multirow  -append -extend { 
        default
        table_name
        exclude
	filters
    } attributes  "attribute_query_2" "
select
 att.attname,
 att.attnum,
 typ.typname,
 (att.atttypmod - 4) as length,
 att.attnotnull,
 att.atthasdef
from
 pg_attribute att,
 pg_type typ
where
 att.attrelid = :table_oid and
 att.attnum > 0 and
 att.atttypid = typ.oid 
order by att.attnum
" {
    set table_name $parent_table
    set default ""
    if {[string match "t" $atthasdef]} {
	set default [db_string adsrc_query "
select 
 adsrc 
from 
 pg_attrdef 
where
 adrelid = :table_oid
and
 adnum = :attnum"]
    }  
    set excluded_attributes [list "tree_sortkey" "object_id"]
    if {[string match "acs_objects" $table_name] && [lsearch $excluded_attributes $attname] > -1 } {
	set exclude "1"
    } else {
	set exclude "0"
    }
    if {[string match "acs_objects" $table_name] && [string match "object_type" $attname] } {
	set default "'$object'"
    }
    if {[string match "int*" $typname]} {
	set filters "integer"

    } else {
	set filters ""
    }
    if {[string match "f" $attnotnull ] && [string match "f" $atthasdef]} {
	set default "null"
	
    } else {
	incr required_attributes
    }
}
    if {![qw_trigger_data $relfilenode args]} {
	break
    }

    set trigger_name [lindex $args 0]
    set from_table [lindex $args 1]
    set ref_table [lindex $args 2]
    set from_attr [lindex $args 4]
    set ref_attr [lindex $args 5]  

    ns_log Notice "ft: $from_table, rt: $ref_table, fa: $from_attr, ra: $ref_attr"
    if {[string match "$from_table" "$ref_table"] } {
 	break
    }
    if {[string match "acs_objects" $parent_table]} {
        break
    }
    if {[qw_primary_keys $table_oid primary_keys] != "1"} {
	break
    }
    if {![string match [lindex $primary_keys 0] $from_attr]} {
	ns_log Notice "from_attr: $from_attr, primary_key: [lindex $primary_keys 0]"
	break
    }
    

    set parent_table $ref_table
    append tables "$parent_table "

}


ad_return_template


