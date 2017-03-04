set form [ns_conn form]

# set default values for each field
set db [ns_db gethandle pool1]
set requiredFieldsSql "select 
 column_name,
 column_type,
 column_length,
 column_title,
 column_help,
 column_data
from 
 hom_interview_questions 
where
 column_enabled = true
order by
 column_sort_order;"

set numberOfFields 0

set result [ns_db select $db $requiredFieldsSql]

while {[ns_db getrow $db $result]} {
    set column_name   [ns_set get $result column_name]
    set column_type   [ns_set get $result column_type]
    set column_length [ns_set get $result column_length]
    set column_title  [ns_set get $result column_title]
    set column_help   [ns_set get $result column_help]
    set column_data   [ns_set get $result column_data]
    set requiredFields($column_name) $column_name
    set requiredFieldTypes($column_name) $column_type
    set requiredFieldLength($column_name) $column_length
    set requiredFieldTitle($column_name) $column_title
    set requiredFieldHelp($column_name) $column_help
    set requiredFieldData($column_name) $column_data
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
            continue
        } 
        
        if {$requiredFieldTypes($key) == "integer" || $requiredFieldTypes($key) == "number"} {
            lappend values "[string map {' ''} $value]"
        } else {
            lappend values "'[string map {' ''} $value]'"
        }
        set requiredFieldsValue($key) $value
        lappend columns $key
        append html "<li>$key = '$value'</li>"
        unset requiredFields($key)
        incr numberOfFields -1
    } else {
        lappend unknown_fields [list $key $value]
    }
}

if {1} {
    set message [list]
    if {$numberOfFields > 0} {
        foreach field [array names requiredFields] {
            if {[lsearch -exact -nocase [list location applicant_name applicant_location counselor counselor_email doc travel] $field ] == -1} {
                continue
            }
            if {$requiredFieldTypes($field) == "button"} {
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
}

if {1} {

    set sql "select 
 * 
from 
 hom_house_address_view
where
 house_name = '[string map {' ''} $requiredFieldsValue(location)]';"

    set result [ns_db 0or1row $db $sql]
    
    if {$result eq ""} {
        ns_return 200 text/plain "Unknown house '$requiredFieldsValue(location)' unable to continue."
        return -code return
    }
    
    set address [ns_set get $result addr2]
    set city    [ns_set get $result city]
    set state   [ns_set get $result state]
    set zip     [ns_set get $result postal_code]
    set paddingSize 8
    set padding [string repeat " " $paddingSize]
    set formatted_address "$padding$address\n$padding$city, $state $zip"

}

set nameList [split $requiredFieldsValue(applicant_name) ,]
set firstName [string trim [lindex $nameList 1]]
set lastName [string trim [lindex $nameList 0]]

set email_message "
To: $requiredFieldsValue(counselor) <$requiredFieldsValue(counselor_email)>
Subject: Accepting $requiredFieldsValue(applicant_name) $requiredFieldsValue(doc)


$requiredFieldsValue(counselor),

Thank you for the applicant and for your time.

We have accepted Mr. $firstName $lastName into our program.  His release address is as follows:

$formatted_address

Point of contact James Valela 206-856-0013

"

switch -exact -nocase -- $requiredFieldsValue(travel) {
    "HOM Pickup" {
        set pickup_text "We will be picking up Mr. $lastName at $requiredFieldsValue(applicant_location) on his day of release."
    }
    "Bus/HOM Pickup" {
        set pickup_text "We will be picking up Mr. $lastName at the bus station on his day of release."        
    }
    "Family Pickup" {
        set pickup_text "We understand Mr. $lastName will be providing his own transportation to the house on his day of release."        
    }
    "Bus Family Pickup" {
        set pickup_text "Mr. $lastName's family will be picking him up at the bus station on the day of release."        
    }
    "DOC Transport" {
        set pickup_text "Mr. $lastName will be transported by DOC on the day of his release."
    }
    "Pending" {
        set pickup_text "Please advise us of Mr. $lastName's travel arrangements as soon as you know."
    }
    default {
        set pickup_text "ERROR HERE UNABLE TO MATCH METHOD IN SWITCH print-confirmation-email.tcl"
    }
}

switch -exact -nocase -- $requiredFieldsValue(pay_method) {
    "Voucher Pending" {
        set pay_method_reminder "when his DOC Voucher is approved and "
    }
    default {
        set pay_method_reminder ""
    }
}


append email_message $pickup_text

append email_message "

Can we please get a photo of Mr. $lastName for our file?

Just a reminder if you can contact us ${pay_method_reminder}when you have a confirmation PRD.

Can you please let Mr. $lastName know he can JayPay us at office@houseofmercyministries.net if he has any questions.

Thank you."

ns_return 200 text/plain $email_message
