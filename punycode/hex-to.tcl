set problem {
    # Enter problem description, exactly started
    Just play around with hex/unicode formatting procs

}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
}

if {[namespace exists ::hex]} {
    namespace delete ::hex
}

namespace eval ::hex {
    variable Table
    variable hexChars [split "0123456789ABCDEF" ""]
    variable log [list]
    variable log_level 0

    for {set i 0} {$i < 7} {incr i} {
        set Table($i) [expr int(pow(16,$i))]
    }
}

proc ::hex::log { level args } {
    variable log
    variable log_level

    if {$log_level <= $level} {
        lappend log [join $args " "]
    }
}

proc ::hex::decimal { char } {
    scan $char %c
}

proc ::hex::to {decimalNumber {n 4}} {
    variable Table
    variable hexChars

    set result ""
    set value ""
    set firstNonZero 0
    set originalDecimalNumber $decimalNumber

    for {set i 6} {$i >= 0} {incr i -1} {
        set H($i) [expr {int($decimalNumber / $Table($i))}]
        if {$H($i) > 0} {
            set firstNonZero 1
            set decimalNumber [expr {$decimalNumber - $H($i) * $Table($i)}]
        }
        if {$H($i) == 0} {
            if {$firstNonZero == 1} {
                append result [lindex $hexChars $H($i)]
            }
        } else {
            append result [lindex $hexChars $H($i)]
        }
    }
    log 4 "::hex::to result = $result decimalNumber=$originalDecimalNumber"
    if {$result eq ""} {
        set result 0
    }
    return $result
}

set digits 12345
set n 9
set log_level 4

set form [ns_conn form]
set digits [ns_set get $form d $digits]
set n [ns_set get $form n $n]
set log_level [ns_set get $form l $log_level]

set result [::hex::to $digits $n]

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Fill In Something Useful</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='d'>Decimal Number</label>
  <input name='d' id='d'  value='$digits'>
 </li>
 <li>
  <label for='n'>N?</label>
  <input name='n' id='n' value='$n'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<pre>
digits = '$digits'
n = '$n'
result = '$result'
log = 
[join $::hex::log \n]
</pre>
</body>
</html>"
