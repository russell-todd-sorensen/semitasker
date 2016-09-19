ad_page_contract {

    Query Writer 
    @author Tom Jackson <tom@junom.com>
    @creation-date 29 January 2002
    @cvs-id $Id: qw.tcl,v 1.38 2003/08/28 22:04:23 iud Exp $
} {
    new:array,trim,optional,allhtml
    set:array,trim,optional,allhtml
    del:array,optional
    {return_url:trim "/"}
} -properties {
    output:onevalue
}

global output
global qw_last_new_object_id

set output ""
set qw_last_new_object_id ""

# get the user_id

set user_id [ad_verify_and_get_user_id]

# get qw group_id 

set qw_group_id [qw_get_group_id]

# list of work to do:

set work_list [list]

# Begin with del

set del_names [array names del]

foreach name $del_names {
    # split the array name at dot
    # to divide into object and id.
    set dl [split $name "."]
    set o [lindex $dl 0]
    set id [lindex $dl 1]

    # check ability of user to admin object
    # this should change to del_perm?
    if {[nsv_get qw_obj_perm $o]} {
      if {![ad_permission_p -user_id $user_id $id "admin"]} {
        ad_complain "You do not have permission to delete object $o with id $id"
        continue
      }
    } 
    # check qw right to del object type
    # ops.x.del(object) must exist, where x is qw_group_id
    if {![qw_if_exists qw_ops.${qw_group_id}.del $o]} {
      ad_complain "You cannot delete objects of type $o"
      continue
    }
    # add valid deletes to list
    lappend work_list "qw_del $id $o"

}

# Now do new
set new_names [array names new]
ns_log Debug "qw.tcl new_names: '$new_names'"


proc ::qw::newarray::divide { qw_group_id inArray newArray {outArray new.}} {

    upvar $inArray IN
    upvar $newArray NEW
    set NAMES [array names IN]
    foreach NAME $NAMES {

	set LIST [split $NAME "."]
	set OBJECT [lindex $LIST 0]
	set ATTRIBUTE [lindex $LIST 1]
	set OUT_ARRAY ${outArray}${OBJECT}.[lindex $LIST 2]
	if {![array exists $OUT_ARRAY]} {
	    upvar $OUT_ARRAY $OUT_ARRAY
	}
	# check if qw_group can create attribute or attribute with specific value
	if {![nsv_exists qw_attrs.${qw_group_id} ${OBJECT}.${ATTRIBUTE}] && ![nsv_exists qw_attrs.${qw_group_id} ${OBJECT}.${ATTRIBUTE}.$IN($NAME)]} {
	    ad_complain "You cannot create $OBJECT objects with attribute $ATTRIBUTE having value '$IN($NAME)'"
	    continue
	}
	# run filters
	if {![qw_run_filters $OBJECT $ATTRIBUTE $IN($NAME)]} {
	    ns_log Debug "qw.tcl: Filters failed for $OBJECT $ATTRIBUTE and '$IN($NAME)'"
	    continue
	}
	# add this to an array named as:
	# new.obj.id
	set ${OUT_ARRAY}(${ATTRIBUTE}) $IN($NAME)
	
	# add to object array, this will probably
	# be done more than once.
	set NEW($OUT_ARRAY) $OBJECT

    }
    ns_log Notice "ARRAYS: [array names NEW]"


}

::qw::newarray::divide $qw_group_id new new_obj_array new.

set uploaded_files [ns_conn files]
ns_log Notice "Uploaded Filds: '$uploaded_files'"
set files_p [llength $uploaded_files]


foreach new_obj [array names new_obj_array] {
      
    # new_obj is: object.id value is object.
    # check if the obj can be created.
    set o $new_obj_array($new_obj)

    # Check that qw_group can create new objects

    if {![qw_if_exists qw_ops.${qw_group_id}.new $o]} {
      ad_complain "You cannot create new objects of type $o"
      continue
    }

    # check for file uploads
    set id [lindex [split $new_obj "."] end]

    if {$files_p} {
	set file_var_pattern new.${o}.*.${id}
	ns_log Notice "File Var Pattern '$file_var_pattern'"
	if {[set file_index [lsearch $uploaded_files $file_var_pattern]] > -1} {
	    # file part of this object.
	    set file_var [lindex $uploaded_files $file_index]
	    set object_attribute [lindex [split $file_var "."] 2]
	    set file_var_list [list]
	    lappend file_var_list $object_attribute $file_var
	    set next_index [expr $file_index + 1]
	    ns_log Notice "next_index: $next_index file_var_list: '$file_var_list'"
	    while {[set next_index [lsearch -start $next_index $uploaded_files $file_var_pattern]] > -1} {
		set file_var [lindex $uploaded_files $next_index]
		set object_attribute [lindex [split $file_var "."] 2]
		lappend file_var_list $object_attribute $file_var
		ns_log Notice "next_index (loop): $next_index $file_var_list: '$file_var_list'"
		incr next_index
		if {[llength $uploaded_files] <= $next_index} {
		    break
		}
	    }

	    lappend work_list "qw_new -FILES \{$file_var_list\} $o $new_obj "
	} else {
	    lappend work_list "qw_new $o $new_obj"
	}
    } else {
	lappend work_list "qw_new $o $new_obj"
    }

}

# Now do set
set set_names [array names set]
ns_log Debug "qw.tcl set_names: '$set_names'"


foreach name $set_names {
    # split the array name at dot
    # the set names look like:
    # obj.attr.id
    set dl [split $name "."]
    set o  [lindex $dl 0]
    set a  [lindex $dl 1]
    set p  ${o}.[lindex $dl 2]

    # check if qw_group can create attribute
    if {![nsv_exists qw_attrs.${qw_group_id} ${o}.${a}] && ![nsv_exists qw_attrs.${qw_group_id} ${o}.${a}.$set($name)] } {

      ad_complain "You cannot update attribute $a of object $o to value '$set($name)'"
      continue
		  
    }
    # run filters
    if {![qw_run_filters $o $a $set($name)]} {
       ns_log Debug "qw.tcl: filters failed for $o $a and '$set($name)'"
       continue
    }

    # add this to an array named as:
    # set.obj.id
    set set.${p}(${a}) $set($name)

    # add to object array, this will probably
    # be done more than once.
    set set_obj_array(set.$p) $o


}

foreach set_obj [array names set_obj_array] {
      
    # set_obj is: object.id value is object.
    # check if the obj can be created.
    set o $set_obj_array($set_obj)

    # Check that qw_group can update object

    if {![qw_if_exists qw_ops.${qw_group_id}.set $o]} {
      ad_complain "You cannot update objects of type $o"
      continue
    }
    set set_obj_list [split $set_obj "."]
    set id [lindex $set_obj_list end]

    if {[nsv_get qw_obj_perm $o]} {
     # check ability of user to write this specific object
      if {![ad_permission_p -user_id $user_id $id "write"]} {
        ad_complain "You do not have permission to update object $o with id $id"
        continue
      }	
    } 
    lappend work_list "qw_set $id $o $set_obj"
}

# time to complain

if {[ad_complaints_count]} {
    # Remove the next complaint for production.
    #ad_complain "Output is [get_output]"
    
    ad_return_complaint [ad_complaints_count] "<li>[join [ad_complaints_get_list] "\n<li>"]"
    return -code return
}


# Process work_list

foreach job $work_list {

    eval $job

}



ad_returnredirect [subst -nobackslashes -nocommands $return_url]
