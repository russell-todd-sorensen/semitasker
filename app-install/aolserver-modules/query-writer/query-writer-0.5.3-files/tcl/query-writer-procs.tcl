# @file: query-writer-procs.tcl
# @author: Tom Jackson <tom@junom.com>
# @creation-date: 8 February 2002
# @cvs-id: $Id: query-writer-procs.tcl,v 1.19 2002/04/01 18:53:30 stellar2 Exp $


ad_proc -public qw_write_fn {object attrs}  {

    <p>Calculates the signature for the passed in object and attributes, 
       and then picks a matching function prototype. If a match is found,
       the information is used to construct a string representing the 
       function call using bind variables. 
    <p>Although this is a public procedure, usually it will be used by
       other query-writer procedures.


} {   
    ns_log Debug "Running qw_write_fn with $object $attrs"
    set query [list]
    set in_args [list]
    set args [concat $attrs]
    foreach {attr sign value} $args {
      lappend in_args $attr
      set attr_array($attr) $value
    }
    set attrs_and_defaults [eval qw_choose_function $object $in_args]
    foreach {attr default_value} $attrs_and_defaults {
      # see if attr was passed in with value
      ns_log Notice "ATTRS: '$attr' default '$default_value'"
      if {![info exists attr_array($attr)]} {
     
        if {[string match "" "$default_value"]} {
          ns_log Error "Attempt to call $object with no value for $attr"
          ns_return 200 text/plain "Attempt to call object $object with no value for $attr, which cannot be null."
          return -code error 
        }
        lappend query "$default_value"
      } else {
        lappend query "$attr_array($attr)"
      } 
    }
    ns_log Debug "${object}([join $query ",\n"]);"
    return "${object}([join $query ",\n"])" 
} 


ad_proc -public qw_add_object {object args} {

  <p>Takes an object name and any number of attributes. Each attribute is
  given a value starting with 1 and continuing: 2, 4, 8, 16 ... 
  Two nsv arrays elemnts are set as a result of these calls.
  <ul>
   <li>qw_pg_objects $object $args  -- holds the list of attributes 
       to the object
   <li>qw_attr_val_$object $attr $n -- holds the attribute value.
  </ul>
  <p>These arrays are used by future calls to qw_add_function.


} {
    nsv_set qw_pg_objects $object $args
    set n 1
    foreach attr $args {
      if {[empty_string_p $attr]} {
        continue
      }
      nsv_set qw_attr_val_$object $attr $n
      set n [expr $n * 2]
    }
}

ad_proc -private qw_total_attributes {object attributes} {

  <p>Procedure to total the attribute values assigned in
     <code>qw_add_object</code>.

} {
    upvar $object object_array
    upvar $attributes attrs
    set total 0
    foreach attribute $attrs {
      ns_log Notice "Adding $attribute"
      incr total $object_array($attribute)

    }
    return $total
}

ad_proc qw_add_function {object args} {
 
    <p>Adds a function prototype to an object. The attributes values assigned
       in <code>qw_add_object</code> are used to assign a signature value to
       the function prototype. The result is stored in an nsv array:
       <ul>
        <li>qw_$object_functions $sig $args
       </ul>
    <p>In addition to defining a function prototype, default values can be assigned
    to any or all attributes. The empty string is a signal that no default is 
    provided, meaning that the attribute must be supplied in the function call.

} {
    # total up the function value.
    array set temp_object [nsv_array get qw_attr_val_$object]
    set i 1
    foreach {attr default} $args {
      lappend attr_list $attr
    }
    set total [qw_total_attributes temp_object attr_list]
    nsv_set qw_${object}_functions $total $args

}

ad_proc -private qw_choose_function {object args} {
 
    <p>Chooses a matching function prototype given a passed in signature.
    The design of the function signature system is to allow function 
    overloading. Several same named function can be used with different
    attributes passed in. 

} {
    array set temp_object [nsv_array get qw_attr_val_$object]
    ns_log Debug "Getting Array: qw_attr_val_$object"
    if {[catch {
        set total [qw_total_attributes temp_object args]
    } err ]} {
        ns_return 200 text/plain "Attribute or Array Not found: qw_attr_val_$object
Probably the attribute has not been added yet, or the function is misnamed."
        return -code return
    }
    if {[nsv_exists qw_${object}_functions $total]} {
       ns_log Debug "Found matching sig: '$total'"
       return [nsv_get qw_${object}_functions $total]
    }
    set functions [nsv_array names qw_${object}_functions]
    foreach sig $functions {
      ns_log Debug "checking sig '$total' against '$sig'"
      if {$total == [expr $sig & $total]} {
        ns_log Debug "Found match '$total' in '$sig'"
        return [nsv_get qw_${object}_functions $sig]
      }
    }
    ns_log Error "!NO MATCH: $total not in $functions"
    return -code error
}


proc qw_if_array_elements_exist {array pattern} {

    if {[string match "" [array get $array $pattern]]} {
      return "0"
    } else {
      return "1"
    }
}

proc qw_if_exists {array element} {


    if {[nsv_exists $array $element ]} {
      return "1"
    } else {
      return "0"
    }
}

ad_proc -public qw_get_group_id { } {

    <p>User implemented procedure to place each user into a specific qw security group.
    QW security groups are used to allow different classes of users access to distinct
    sets of attributes and actions on these attributes. The query-writer package starts
    with two security groups: <code>admin</code> and <code>default</code>. The 
    <code>admin</code> group is generally given free reign to alter any attribute. 
    The <code>default</code> group is 
    usually assigned only the bare minimum attributes and methods needed for using the 
    application.
    <p>One idea for implimenting this function is to wrap <code>ad_permission_p</code>
     and test the root object <code>0</code>. 
    <p>This procedure should be replace by the developer with something more useful.

} {
    return 1

}

ad_proc -private qw_del_pl_postgresql { } {

    <p>User defined procedure to write and execute the procedural language 
       code call to delete the object.

} {
    uplevel 1 {
      set key [nsv_get qw_obj_key $object]
      set pl "select [qw_write_fn [nsv_get qw_del_fn $object] [subst { $key => :id }]]"

      db_exec_plsql qw_del_pl_postgresql $pl
    }
}
ad_proc -private qw_del_dml_postgresql { } {

    <p>User defined procedure to write and execute the dml to delete an object.

} {
    uplevel 1 {
  
      set table [nsv_get qw_obj_table $object]
      set key [nsv_get qw_obj_key $object]
      set dml "delete from $table where $key = :id"
 
      db_dml qw_del_dml_postgresql $dml 
    }
}

ad_proc -private qw_new_pl_postgresql { } {

    <p>User defined procedure to write and execute procedural language to create
    a new object.

} {
    uplevel 1 {
      set PL ""
      
      foreach ATTR [array names ARR] {
        # set each ATTR to local var.
        set $ATTR $ARR($ATTR)
        lappend ATTR_LIST "[nsv_get qw_id_to_attr ${OBJECT}.${ATTR}] => :$ATTR "

      }

      # work through extra vars in to_eval
      if {[nsv_exists qw_to_eval $OBJECT]} {
        foreach {VAR EVAL_STMT} [split [nsv_get qw_to_eval $OBJECT] ";"] {
          eval $EVAL_STMT
          lappend ATTR_LIST "$VAR => :$VAR "
        }
      }

      append PL "select [qw_write_fn [nsv_get qw_new_fn $OBJECT] [subst { [join $ATTR_LIST "\n"]}]] "
 
      set qw_last_new_object_id [db_string qw_new_pl_postgresql $PL]
      
    }
}

ad_proc -private qw_new_dml_postgresql { } {

    <p>User defined procedure to write and execute the dml to create a new object.

} {
    uplevel 1 {
      set DML ""
      set BIND_VAR_LIST [list]
      foreach ATTR [array names ARR] {
        # set each ATTR to local var.
        set $ATTR $ARR($ATTR)
        lappend ATTR_LIST "[nsv_get qw_id_to_attr ${OBJECT}.${ATTR}]"
        lappend BIND_VAR_LIST ":$ATTR"

      }

      # work through extra vars in to_eval
      if {[nsv_exists qw_to_eval $OBJECT]} {
        ns_log Debug "FOUND EVAL for '$OBJECT'"
	  foreach {VAR EVAL_STMT} [split [nsv_get qw_to_eval $OBJECT] ";" ] {
          ns_log Debug "EVAL: '$EVAL_STMT'"
          eval $EVAL_STMT
          lappend ATTR_LIST "$VAR"
          lappend BIND_VAR_LIST ":$VAR"
        }
      }
      append DML "insert into [nsv_get qw_obj_table $OBJECT] ([join $ATTR_LIST ", "]) values ([join $BIND_VAR_LIST ", "]) "

      db_dml qw_new_dml_postgresql $DML
    }
}
ad_proc -private qw_set_pl_postgresql { } {

    <p>User defined procedure to write and execute the procedural language code
    to update an object.

} {
    uplevel 1 {
      set PL ""
 
      foreach ATTR [array names ARR] {
        # set each ATTR to local var.
        set $ATTR $ARR($ATTR)
        if {![empty_string_p $ARR($ATTR)]} {
          lappend ATTR_LIST "[nsv_get qw_id_to_attr ${OBJECT}.${ATTR}] => :$ATTR"
        } else {
          lappend ATTR_LIST "[nsv_get qw_id_to_attr ${OBJECT}.${ATTR}] => ''"
        }
 
			}

      # set the primary key attr
      set PKEY [nsv_get qw_obj_key $OBJECT]
      set $PKEY $ID
      lappend ATTR_LIST "$PKEY => :$PKEY"

      append PL "select [qw_write_fn [nsv_get qw_set_fn $OBJECT] [subst { [join $ATTR_LIST "\n"]}]] "
      db_exec_plsql qw_set_pl_postgresql $PL

    }
}

ad_proc -private qw_set_dml_postgresql { } {

    <p>User defined procedure to write the dml to update an object.

} {
    uplevel 1 {
      set DML ""
 
      foreach ATTR [array names ARR] {
        # set each ATTR to local var.
        set $ATTR $ARR($ATTR)
        if {![empty_string_p $ARR($ATTR)]} {
	    lappend ATTR_LIST "[nsv_get qw_id_to_attr ${OBJECT}.${ATTR}]  = :$ATTR"
        } elseif {[string match "integer" [nsv_get qw_datatype ${OBJECT}.${ATTR}]]} {
            # Lars suggestion that empty string should mean null in case of integer.
	    lappend ATTR_LIST "[nsv_get qw_id_to_attr ${OBJECT}.${ATTR}]  = NULL"
        } else {
          lappend ATTR_LIST "[nsv_get qw_id_to_attr ${OBJECT}.${ATTR}] = ''"
        }
 
      }

      # set the primary key attr
      set PKEY [nsv_get qw_obj_key $OBJECT]
      set $PKEY $ID

      append DML "update [nsv_get qw_obj_table $OBJECT] set [join $ATTR_LIST ", "] where $PKEY = :$PKEY"
      db_dml qw_set_dml_postgresql $DML
    }
}

ad_proc -public qw_del { id object } {

    <p>Deletes a named object with the given id. This procedure is part of the 
    tcl api.

} {
    if {[nsv_exists qw_del_fn $object]} {
       # Delete using pl
       [nsv_get qw_obj_del pl] ;# qw_del_pl_postgresql
    } elseif {[nsv_exists qw_obj_table $object]} {
       # use the standard sql delete
       [nsv_get qw_obj_del dml] ;# qw_del_dml_postgresql 
    } else {
       # no way to delete object, ignore and log
       ns_log Error "qw_del: No Method to delete object '$object' with id '$id'" 
    }
   
}


ad_proc -public qw_new { OBJECT ARRAY } {

    <p>Creates a new object given the object name and an array of attributes.
    This procedure is part of the tcl api. When using this procedure directly,
    you can build up the array like this:
    <pre>
    set in_array(attr1) value1
    set in_array(attr2) value2
    # then call qw_new
    qw_new my_object in_array
    </pre>


} {
    # Note internal variable names are all caps
    # to avoid clashing with attr names passed in.
    ns_log Debug "qw_new: object '$OBJECT' array '$ARRAY'"
    upvar $ARRAY ARR
    global qw_last_new_object_id
    set ATTR_LIST [list]

    if {[nsv_exists qw_new_fn $OBJECT]} {
      # use pl to create new obj
      [nsv_get qw_obj_new pl] ;# qw_new_pl_postgresql
    } elseif {[nsv_exists qw_obj_table $OBJECT]} {
      # use standard dml for insert
      [nsv_get qw_obj_new dml] ;# qw_new_dml_postgresql
    } else {
      # no way to create new object, ignore and log
      ns_log Error "qw_new: No Method to insert new object '$OBJECT'"
 } 


}

ad_proc -public qw_set { ID OBJECT ARRAY } {

    <p>Updates an object given the object id, the object name and an array
    holding the attributes to be updated. This procedure is part of the 
    query-writer tcl api. You can use this procedure directly as follows:
   <pre>
    set in_array(attr1) value1
    set in_array(attr2) value2
    # then call qw_new
    qw_set $id my_object in_array
    </pre>



} {
    # Note internal variable names are all caps
    # to avoid clashing with attr names passed in.
    ns_log Debug "qw_set: object '$OBJECT' array '$ARRAY'"
    upvar $ARRAY ARR
    set ATTR_LIST [list]

    if {[nsv_exists qw_set_fn $OBJECT]} {
      # use pl to update attrs
      [nsv_get qw_obj_set pl] ;# qw_set_pl_postgresql
    } elseif {[nsv_exists qw_obj_table $OBJECT]} {
      # use standard dml for update
      [nsv_get qw_obj_set dml] ;# qw_set_dml_postgresql
    } else {
      # no way to update object, ignore and log
      ns_log Error "qw_set: No Method to update object '$OBJECT'"
 } 


}

ad_proc -public qw_run_filters {object attr value } {

    <p>Runs filters registered for the object attribute. Additionally,
    this procedure runs a length filter for attributes that have a
    maximum length.


} {
  set return_value 1
  ns_log Debug "qw_run_filters: object '$object' '$attr' '$value'"
  if {[nsv_exists qw_filters ${object}.${attr}]} {
    foreach filter [split [nsv_get qw_filters ${object}.${attr} ] ","] {
      # Run filter
      ns_log Debug "qw_run_filters: filter '$filter'"
      if {![ad_page_contract_filter_proc_$filter $attr value]} {
        set return_value 0
      }
    }
  }
  if {[nsv_exists qw_length ${object}.${attr}]} {
    if {[string length $value] > [nsv_get qw_length ${object}.${attr}]} {
      if {[nsv_exists qw_attr_desc ${object}.${attr} ]} {
        set desc [nsv_get qw_attr_desc ${object}.${attr}]
      } else {
        set desc $attr
      }
      ad_complain "$desc has a maximum length of [nsv_get qw_length ${object}.${attr}]. The value you entered is [string length $value] characters long.</li>"
      set return_value 0
    }
  }
  return $return_value
}


proc qw_attr_perm_map { group_id object_id attr_id values ops } {

    set ops_list [split $ops ";"]
    ns_log Notice "qw_attr_perm_map ops_list $ops_list"
    # do del ops.
    if {[lsearch $ops_list "del"] > -1} {
      ns_log Notice "qapm: mapping del 'qw_ops.${group_id}.del $object_id 1'"
      nsv_set qw_ops.${group_id}.del $object_id 1
    }
    if {[lsearch $ops_list "new"] > -1} {
      ns_log Notice "qapm: mapping new 'qw_ops.${group_id}.new $object_id 1'"
      nsv_set qw_ops.${group_id}.new $object_id 1
    }
    if {[lsearch $ops_list "set"] > -1} {
      ns_log Notice "qapm: mapping set 'qw_ops.${group_id}.set $object_id 1'"
      nsv_set qw_ops.${group_id}.set $object_id 1
    }
    if {[empty_string_p $values]} {
      ns_log Notice "qapm: mapping attr 'qw_attrs.${group_id} ${object_id}.${attr_id} 1'"
      nsv_set qw_attrs.${group_id} ${object_id}.${attr_id} 1 
    } else {
      foreach value [split $values ";"] { 
        ns_log Notice "qapm: mapping attr-val 'qw_attrs.${group_id} ${object_id}.${attr_id}.${value} 1'"
	nsv_set qw_attrs.${group_id} ${object_id}.${attr_id}.${value} 1
      }
    }

}




proc qw_attr_perm_unmap { group_id object_id attr_id values ops } {

    set ops_list [split $ops ";"]
    ns_log Notice "qw_attr_perm_unmap ops_list $ops_list"
    # do del ops.
    if {[lsearch $ops_list "del"] > -1} {
      if {[nsv_exists qw_ops.${group_id}.del $object_id ]} {
        ns_log Notice "qapm: unmapping del 'qw_ops.${group_id}.del $object_id'"
        nsv_unset qw_ops.${group_id}.del $object_id 
		  }
    }
    if {[lsearch $ops_list "new"] > -1} {
      if {[nsv_exists qw_ops.${group_id}.new $object_id]} {
        ns_log Notice "qapm: unmapping new 'qw_ops.${group_id}.new $object_id'"
        nsv_unset qw_ops.${group_id}.new $object_id 
      }
    }
    if {[lsearch $ops_list "set"] > -1} {
      if {[nsv_exists qw_ops.${group_id}.set $object_id ]} {
        ns_log Notice "qapm: unmapping set 'qw_ops.${group_id}.set $object_id'"
			  nsv_unset qw_ops.${group_id}.set $object_id 
      }
      if {[empty_string_p $values]} {
        if {[nsv_exists qw_attrs.${group_id} ${object_id}.${attr_id}]} {
          ns_log Notice "qapm: unmapping attr 'qw_attrs.${group_id} ${object_id}.${attr_id}'"
          nsv_unset qw_attrs.${group_id} ${object_id}.${attr_id} 
        }
      } else {
        foreach value [split $values ";"] { 
	  if {[nsv_exists qw_attrs.${group_id} ${object_id}.${attr_id}.${value}]} {
            ns_log Notice "qapm: unmapping attr-val 'qw_attrs.${group_id} ${object_id}.${attr_id}.${value}'"
            nsv_unset qw_attrs.${group_id} ${object_id}.${attr_id}.${value}
          }
        }
      }
    }
}


proc qw_map_id_to_object {object_id object} {
    
    ns_log Notice "qmito: map 'qw_id_to_object ${object_id} $object'"
    nsv_set qw_id_to_object ${object_id} $object

}

proc qw_unmap_id_to_object { object_id } {

    ns_log Notice "qumito: unmap 'qw_id_to_object ${object_id}'"
    nsv_unset qw_id_to_object ${object_id}

}

proc qw_map_id_to_attr { object_id attr_id attr } {

    ns_log Notice "qmita: map 'qw_id_to_attr ${object_id}.${attr_id} $attr'"
    nsv_set qw_id_to_attr ${object_id}.${attr_id} $attr    

}

proc qw_unmap_id_to_attr { object_id attr_id } {

    if {[nsv_exists qw_id_to_attr ${object_id}.${attr_id}]} {
      ns_log Notice "quita: unmap 'qw_id_to_attr ${object_id}.${attr_id}'"
      nsv_unset qw_id_to_attr ${object_id}.${attr_id}  
    } 

}



proc qw_map_filter { object_id attr_id filters } {

    if {![empty_string_p $filters]} {
      ns_log Notice "qmf: map 'qw_filters ${object_id}.${attr_id} [split $filters ";"]'"
      nsv_set qw_filters ${object_id}.${attr_id} [split $filters ";"]
    }
 
}

proc qw_unmap_filter { object_id attr_id } {

    if {[nsv_exists qw_filters ${object_id}.${attr_id}]} {
      ns_log Notice "quf: unmap 'qw_filters ${object_id}.${attr_id}'"
      nsv_unset qw_filters ${object_id}.${attr_id}
    }

}

# MAP DATATYPE #
proc qw_map_datatype { object_id attr_id datatype } {

    if {![empty_string_p $datatype]} {
      ns_log Notice "qmd: map 'qw_datatype ${object_id}.${attr_id} [split $datatype ";"]'"
      nsv_set qw_datatype ${object_id}.${attr_id} $datatype
    }
 
}

proc qw_unmap_datatype { object_id attr_id } {

    if {[nsv_exists qw_datatype ${object_id}.${attr_id}]} {
      ns_log Notice "qud: unmap 'qw_datatype ${object_id}.${attr_id}'"
      nsv_unset qw_datatype ${object_id}.${attr_id}
    }

}

proc qw_unmap_obj_properties {object_id} {

    if {[db_0or1row obj_unmap_properties_query "
select 
 obj_table,
 key as obj_key,
 to_eval,
 new_fn,
 set_fn,
 del_fn,
 rst_fn,
 perm_p as obj_perm
from 
 qw_objects
where
 object_id = :object_id " ]} {
      # do the mapping
      foreach attr [list obj_table obj_key new_fn set_fn del_fn rst_fn to_eval obj_perm] {
         
        if {![empty_string_p [set $attr]] && [nsv_exists qw_$attr $object_id]} {
          ns_log Notice "quop: unmap 'qw_$attr $object_id'"
          nsv_unset qw_$attr $object_id
        }
      }
     }
}

proc qw_map_obj_properties {object_id} {

    if {[db_0or1row obj_map_properties_query "
select 
 obj_table,
 key as obj_key,
 to_eval,
 new_fn,
 set_fn,
 del_fn,
 rst_fn,
 perm_p as obj_perm
from 
 qw_objects
where
 object_id = :object_id " ]} {
      # do the mapping
      foreach attr [list obj_table obj_key new_fn set_fn del_fn rst_fn to_eval obj_perm] {
         
        if {![empty_string_p [set $attr]]} {
          ns_log Notice "qmop: map 'qw_$attr $object_id [set $attr]'"
	  nsv_set qw_$attr $object_id [set $attr]
        }
      }
   }

}


### GENERIC NSV MAPPER ########


proc qw_map_nsv {nsv_name nsv_element nsv_value} {

    ns_log Notice "qmn: map '$nsv_name $nsv_element $nsv_value'"
    nsv_set $nsv_name $nsv_element $nsv_value

}
proc qw_unmap_nsv {nsv_name nsv_element} {

    if {[nsv_exists $nsv_name $nsv_element]} {
      ns_log Notice "qun: map '$nsv_name $nsv_element'"
      nsv_unset $nsv_name $nsv_element
    }
}

#### ATTR LENGTH #######


proc qw_map_attr_length {object_id attr_id length} {

    if {$length > 0} {
        ns_log Notice "qwal: map 'qw_length ${object_id}.${attr_id} $length'" 
        nsv_set qw_length ${object_id}.${attr_id} $length
    }

}
proc qw_unmap_attr_length {object_id attr_id} {

    if {[nsv_exists qw_length ${object_id}.${attr_id}]} {
        ns_log Notice "qual: unmap 'qw_length ${object_id}.${attr_id}'" 
        nsv_unset qw_length ${object_id}.${attr_id}
    }

}


##### ATTR DESCRIPTION AND HELP TEXT ######


proc qw_map_attr_txt {object_id attr_id description help_text} {

    ns_log Notice "qmat: map 'qw_attr_desc ${object_id}.${attr_id} $description'"
    nsv_set qw_attr_desc ${object_id}.${attr_id} $description
    if {![empty_string_p $help_text]} {
      ns_log Notice "qmat: map 'qw_attr_help ${object_id}.${attr_id} $help_text'" 
      nsv_set qw_attr_help ${object_id}.${attr_id} $help_text
    }

}

proc qw_unmap_attr_txt {object_id attr_id} {

    if {[nsv_exists qw_attr_desc ${object_id}.${attr_id}]} {
      ns_log Notice "quat: unmap 'qw_attr_desc ${object_id}.${attr_id}'"
      nsv_unset qw_attr_desc ${object_id}.${attr_id}
    }
    if {[nsv_exists qw_attr_help ${object_id}.${attr_id}]} {
      ns_log Notice "quat: unmap  'qw_attr_help ${object_id}.${attr_id}'"
      nsv_unset qw_attr_help ${object_id}.${attr_id}
    }

}


## Write Object Functions ###
ad_proc -public qw_write_obj_functions { } {

    <p>Procedure to write and execute the <code>qw_add_object</code> and 
    <code>qw_add_function</code> calls. Calling this procedure after server
    startup will only overwrite matching data. If an old function needs to be
    removed, this procedure may not do what you want.

} {
    set obj_sql "
select
 qo.object,
 qa.*,
 qf.*
from
 qw_objects qo,
 qw_attrs qa,
 qw_fns qf
where
 qo.object_id = qf.object_id
and
 qf.object_id = qa.object_id
order by qa.attr"


    db_foreach obj_attr_qry $obj_sql {
   
        if {[info exists _$fn_id]} {
            lappend _$fn_id "$attr"
        } else {
            set _$fn_id [list]
            lappend _$fn_id "$attr"
		    }
    
        if {![string match "" $joiner]} {
            set full_function_name($fn_id) $object$joiner$name
        } else {
            set full_function_name($fn_id) $name
        }
    }

    foreach name [array names full_function_name] {

        ns_log Notice "qw_add_object $full_function_name($name) [join [set _$name] " "]\n"
        eval "qw_add_object $full_function_name($name) [join [set _$name] " "]"
     }

    array unset full_function_name
    # add functions

    set fn_sql "
select
 qo.object,
 qf.*,
 qfa.*
from
 qw_objects qo,
 qw_fns qf,
 qw_fn_attrs qfa
where
 qo.object_id = qf.object_id
and
 qf.fn_id = qfa.fn_id
order by qfa.fn_id, qfa.attr_order"

    db_foreach fn_attr_qry $fn_sql {

        if {[info exists a__$fn_id]} {
            lappend a__$fn_id "$attr \"$default_value\""
            ns_log debug "ADDING($object -- $name)  $attr \"$default_value\" to a__$fn_id"
        } else {
            set a__$fn_id [list]
            lappend a__$fn_id "$attr \"$default_value\""
            ns_log debug "ADDING($object -- $name)   $attr \"$default_value\" to a__$fn_id"
        }

        if {![string match "" $joiner]} {
            set full_function_name($fn_id) $object$joiner$name
        } else {
            set full_function_name($fn_id) $name
        }

    }

    foreach name  [array names full_function_name] {

        ns_log Notice "qw_add_function $full_function_name($name) [join [set a__$name] " "]\n"
        eval "qw_add_function $full_function_name($name) [join [set a__$name] " "]"
    } 

}

# procs to help with getting the current url for calculating the
# return_url

ad_proc -public qw_this_url { } {

    <p>A convenience function for calculating the tcl/template url, without the
    query string. This procedure is usually used in calculating the 
    <code>return_url</code> variable used in all forms which use the 
    <code>qw.tcl</code> file.

} {
    return [ad_conn url]
}

ad_proc -public qw_this_dir { } {

    <p>A convenience function for calculating the tcl/template directory.
     This procedure is usually used in calculating the 
    <code>return_url</code> variable used in all forms which use the 
    <code>qw.tcl</code> file.

} {

    set url [qw_this_url]
    # check if last char is /
    if {[string match "/" [string index $url end]]} {
        return $url
    } else {
        return "[file dirname $url]/"
    }
}
