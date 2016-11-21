set form [ns_conn form]

# set default values for each field
set db [ns_db gethandle pool1]

set requiredFieldsSql "select 
 column_name,
 column_type,
 column_length,
 column_title,
 column_help,
 column_data,
 column_default
from 
 hom_interview_questions 
where
 column_enabled = true
order by
 column_sort_order;"

set numberOfFields 0

set result [ns_db select $db $requiredFieldsSql]

while {[ns_db getrow $db $result]} {
    set column_name    [ns_set get $result column_name]
    set column_type    [ns_set get $result column_type]
    set column_length  [ns_set get $result column_length]
    set column_title   [ns_set get $result column_title]
    set column_help    [ns_set get $result column_help]
    set column_data    [ns_set get $result column_data]
    set column_default [ns_set get $result column_default]
    
    set requiredFields($column_name) $column_name
    set requiredFieldTypes($column_name) $column_type
    set requiredFieldLength($column_name) $column_length
    set requiredFieldTitle($column_name) $column_title
    set requiredFieldHelp($column_name) $column_help
    set requiredFieldData($column_name) $column_data
    set requiredFieldDefault($column_name) $column_default
    incr numberOfFields
}

set html "<ul>"

    
set columns [list]
set values [list]
for {set i 0} {$i < [ns_set size $form]} {incr i} {
    
    set key [ns_set key $form $i]
    set value [ns_set value $form $i]
    
    if {[info exists requiredFields($key)]} {
        
        if {[string trim $value] == ""} {
            if {$requiredFieldDefault($key) == ""} {
                continue
            } else {
                set value $requiredFieldDefault($key)
            }
        } 
        
        if {$requiredFieldTypes($key) == "integer" || $requiredFieldTypes($key) == "number"} {
            lappend values "[string map {' ''} $value]"
        } else {
            lappend values "'[string map {' ''} $value]'"
        }
        
        lappend columns $key
        append html "<li>$key = '$value'</li>"
        unset requiredFields($key)
        incr numberOfFields -1
    } else {
        lappend unknown_fields [list $key $value]
    }
}

set message [list]
if {$numberOfFields > 0} {
    foreach field [array names requiredFields] {
        if {$requiredFieldTypes($field) == "button" || $field == "birthdate"} {
            continue   
        } else {
            lappend message "<li>$field : $requiredFieldTitle($field) : $requiredFieldHelp($field)</li>\n"
        }
    }
}

if {[llength $message]} {
    ns_return 200 text/html "<h3>Required Fields Missing</h3>
<ul>
[join $message "\n "]
</ul>
<p>Please use your back button to correct the problem and resubmit."
    return -code return
}

append html "</ul>"

set table hom_applicant_interview

set sql "insert into $table ([join $columns ",\n"]) values ([join $values ",\n"]);"

ns_db exec $db $sql
ns_return 200 text/plain $sql