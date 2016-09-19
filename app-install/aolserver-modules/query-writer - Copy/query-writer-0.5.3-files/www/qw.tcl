ad_page_contract {

    Query Writer 
    @author Tom Jackson <tom@junom.com>
    @creation-date 29 January 2002
    @cvs-id $Id: qw.tcl,v 1.33 2002/03/14 09:06:48 nsadmin Exp $
} {
    new:array,trim,optional
    set:array,trim,optional
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

# Begin with del

set work_list [list]

# Now do new
set new_names [array names new]
ns_log Debug "qw.tcl new_names: '$new_names'"
foreach name $new_names {
    # split the array name at dot
    # the new names look like:
    # obj.attr.id
    set dl [split $name "."]
    set o  [lindex $dl 0]
    set a  [lindex $dl 1]
    set p  ${o}.[lindex $dl 2]

    # check if qw_group can create attribute or attribute with specific value
    if {![nsv_exists qw_attrs.${qw_group_id} ${o}.${a}] && ![nsv_exists qw_attrs.${qw_group_id} ${o}.${a}.$new($name)]} {
      ad_complain "You cannot create $o objects with attribute $a having value '$new($name)'"
      continue
    }

    # run filters
    if {![qw_run_filters $o $a $new($name)]} {
      ns_log Debug "qw.tcl: filters failed for $o $a and '$new($name)'"
      continue
    }

    # add this to an array named as:
    # new.obj.id
    set new.${p}(${a}) $new($name)

    # add to object array, this will probably
    # be done more than once.
    set new_obj_array(new.$p) $o


}

foreach new_obj [array names new_obj_array] {
      
    # new_obj is: object.id value is object.
    # check if the obj can be created.
    set o $new_obj_array($new_obj)

    # Check that qw_group can create new objects

    if {![qw_if_exists qw_ops.${qw_group_id}.new $o]} {
      ad_complain "You cannot create new objects of type $o"
      continue
    }

    lappend work_list "qw_new $o $new_obj"

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

      ad_complain "You cannot update  attribute $a of object $o to value '$set($name)'"
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
    # check ability of user to write this specific object
    if {[nsv_get qw_obj_perm $o]} {
      set id [lindex [split $set_obj "."] end]
      if {![ad_permission_p -user_id $user_id $id "write"]} {
        ad_complain "You do not have permission to update object $o with id $id"
        continue
      }
		
    } else {
        # No need to check permission with permission_p
        set id [lindex [split $set_obj "."] end]
    }
   
    lappend work_list "qw_set $id $o $set_obj"

}

set del_names [array names del]

foreach name $del_names {
    # split the array name at dot
    # to divide into object and id.
    set dl [split $name "."]
    set o [lindex $dl 0]
    set id [lindex $dl 1]

    # check ability of user to admin object
    if {[nsv_get qw_obj_perm $o]} {
      if {![ad_permission_p -user_id $user_id $id "admin"]} {
        ad_complain "You do not have permission to delete object $o with id $id"
        continue
      }
    } 
    # check qw right to del object 
    # ops.x.del(object) must exist, where x is qw_group_id
    if {![qw_if_exists qw_ops.${qw_group_id}.del $o]} {
      ad_complain "You cannot delete objects of type $o"
      continue
    }
    # add valid deletes to list
    lappend work_list "qw_del $id $o"

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
