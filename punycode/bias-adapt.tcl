set problem {
    # Enter problem description, exactly started
    6.1 Bias adaptation function

   function adapt(delta,numpoints,firsttime):
     if firsttime then let delta = delta div damp
     else let delta = delta div 2
     let delta = delta + (delta div numpoints)
     let k = 0
     while delta > ((base - tmin) * tmax) div 2 do begin
       let delta = delta div (base - tmin)
       let k = k + base
     end
     return k + (((base - tmin + 1) * delta) div (delta + skew))

   It does not matter whether the modifications to delta and k inside
   adapt() affect variables of the same name inside the
   encoding/decoding procedures, because after calling adapt() the
   caller does not read those variables before overwriting them.

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

    for {set i 0} {$i < 7} {incr i} {
        set Table($i) [expr int(pow(16,$i))]
    }
}

proc ::hex::decimal { char } {
    scan $char %c
}

proc ::hex::to {decimalNumber} {
    variable Table
    variable hexChars

    set result ""
    set value ""
    set firstNonZero 0

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

    expr {$result eq "" ? "0" : $result}
}

if {[namespace exists ::punycode]} {
    namespace delete ::punycode
}

namespace eval ::punycode {
    variable base 36
    variable tmin 1
    variable tmax 26
    variable skew 38
    variable damp 700
    variable initial_bias 72
    variable initial_n = 128
    variable digit_value
    variable code_points_lc "abcdefghijklmnopqrstuvwxyz0123456789"
    variable code_points_uc "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

}

namespace eval ::punycode {

    set i 0
    foreach cpt [split $code_points_lc ""] {
        set digit_value($cpt) $i
        set digit_value([::hex::to [::hex::decimal $cpt]]) $i
        incr i
    }
    set i 0
    foreach cpt [split $code_points_uc ""] {
        set digit_value($cpt) $i
        set digit_value([::hex::to [::hex::decimal $cpt]]) $i
        incr i
    }
    unset i
}

proc ::punycode::adapt {delta numpoints firsttime} {
    variable damp
    variable base
    variable tmin
    variable tmax
    variable skew

    if {$firsttime} {
        set delta [expr {int($delta / $damp)}]
    } else {
        set delta [expr {$delta + int($delta / 2)}]
    }

    set delta [expr {$delta + int($delta / $numpoints)}]

    set k 0
    while {$delta > int((($base - $tmin) * $tmax) / 2)} {
        set delta [expr {int($delta / ($base - $tmin))}]
        incr k $base
    }

   return [expr {$k + int((($base - $tmin + 1) * $delta) / ($delta + $skew))}]
}

#       xn--n5gcsb.ws == ↈↀↁↇ.ws
# xn--abc-su1ag1bb.ws == ↈaↀbↁcↇ.ws
proc ::punycode::decode { a_label } {

    variable initial_n
    variable initial_bias

    set n initial_n
    set i 0
    set bias = initial_bias
    set output = ""

}

set delta 0
set numpoints 10
set firsttime 1

set form [ns_conn form]
set delta [ns_set get $form d $delta]
set numpoints [ns_set get $form n $numpoints]
set firsttime [ns_set get $form f $firsttime]
set result [::punycode::adapt $delta $numpoints $firsttime]

set dvout ""
foreach ele [lsort [array names ::punycode::digit_value]] {
    append dvout "digit_value($ele) = '$::punycode::digit_value($ele)'\n"
}

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
  <label for='d'>Delta</label>
  <input name='d' id='d' value='$delta'>
 </li>
 <li>
  <label for='n'>Number of Points</label>
  <input name='n' id='n' value='$numpoints'>
 </li>
 <li>
  <label for='f'>FirstTime?</label>
  <input name='f' id='f' value='$firsttime'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
delta = '$delta'
numpoints = '$numpoints'
firsttime = '$firsttime'
result = '$result'
Table = [array get ::hex::Table]
digit_values =
$dvout
</pre>
</body>
</html>"
