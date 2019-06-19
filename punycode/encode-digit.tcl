
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
    variable log [list]
    variable base 36
    variable tmin 1
    variable tmax 26
    variable skew 38
    variable damp 700
    variable initial_bias 72
    variable initial_n 128
    variable digit_value
    variable code_points_lc "abcdefghijklmnopqrstuvwxyz0123456789"
    variable code_points_uc "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    variable basic_code_points "$code_points_lc$code_points_uc"
    variable maxint [expr {2<<26}]
    variable firsttime 1
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

proc ::punycode::encode_digit { d {flag 0}} {
    if {$flag != 0} {
        set flag 1
    }
    set val [expr { $d + 22 + 75 * ($d < 26) - (($flag != 0) << 5)}]
    log 4 "encode_digit val = $val digit = [format %c $val]"
    return [format %c $val]
    #  0..25 map to ASCII a..z or A..Z
    # 26..35 map to ASCII 0..9
}


proc ::punycode::basic { cp } {
    expr {[scan $cp %c] < [scan 0x80 %x]}
}


proc ::punycode::log { level args } {
    variable log
    variable log_level

    if {$log_level > $level} {
        lappend log [join $args " "]
    }
}

proc ::punycode::check_a_plus_b_overflow_p { A B } {
    # verify b doesn't cause overflow
    variable maxint
    expr {$B > ($maxint - $A)}
}

proc ::punycode::check_a_plus_b_x_c_overflow_p { A B C } {
    #A + (B * C) Does not overflow ?
    variable maxint
    if {$C == 0} {
        return -code error "Divide By Zero in check_a_plus_b_x_c_overflow_p"
    }
    expr {$B > int(($maxint - $A) / $C)}
}

proc ::punycode::is_valid_code_point { char } {
    variable digit_value
    info exists digit_value($char)
}

proc ::punycode::is_basic_code_point { char } {
    variable basic_code_points
    expr {[string first $char $basic_code_points] > -1 ? true : false}
}


proc ::punycode::adapt {delta numpoints firsttime} {
    variable damp
    variable base
    variable tmin
    variable tmax
    variable skew

    log 4 "adapt delta=$delta numpoints=$numpoints firsttime=$firsttime"
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

proc ::punycode::adapt2 { delta numpoints} {
    variable firsttime
    variable damp
    variable tmin
    variable tmax
    variable base
    variable skew

    if {$firsttime == 1} {
        set delta [expr {$delta / $damp}]
        set firsttime 0
    } else {
        set delta [expr {$delta >> 1}]
    }
    for {set k 0} {int($delta) > int((($base - $tmin) * $tmax) / 2)} {incr k $base} {
        set delta [expr $delta / ($base - $tmin)]
    }
    expr {$k + (($base - $tmin + 1) * $delta / ($delta + $skew))}
}

proc ::punycode::is_overflow { x } {
    return false
}

proc ::punycode::decode_digit { cp } {
    variable base
    set cp [scan $cp %c]
    expr {$cp - 48 < 10 ? $cp - 22 :
          $cp - 65 < 26 ? $cp - 65 :
          $cp - 97 < 26 ? $cp - 97 :
          $base}
}

#       xn--n5gcsb.ws == ↈↀↁↇ.ws
# xn--abc-su1ag1bb.ws == ↈaↀbↁcↇ.ws


set u_label "ↈaↀbↁcↇ"
set log_level 0
set args {102 0}
set proc encode_digit

set form [ns_conn form]
set args [ns_set get $form a $args]
set proc [ns_set get $form p $proc]
set log_level [ns_set get $form l $log_level]

set ::punycode::log_level $log_level

if {[catch {
    set result [::punycode::$proc {*}$args]
    set ok 1
} err]} {
    global errorInfo
    set result $errorInfo
    set ok 0
}

set ok 0
if {$ok} {
    set unicode [list]
    set uniline ""
    set i 1
    set lines 0
    foreach cp [split $result ""] {
        if {[string is upper $cp]} {
            set u U
        } else {
            set u u
        }
        set ucp ${u}+[format %0.4X [scan $cp %c]]
        append uniline "$ucp "
        #::punycode::log $ucp
        if {($i % 9) == 0} {
            lappend unicode $uniline
            set uniline ""
            incr lines
        }
        incr i
    }
    if {$lines == [llength $unicode]} {
        lappend unicode $uniline
    }
} else {
    set unicode [list "no result"]
}

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Test Tcl PunyCode</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='a'>Args</label>
  <input name='a' id='a' value='$args'>
 </li>
 <li>
  <label for='p'>Proc</label>
  <input name='p' id='p' value='$proc'>
 </li>
 <li>
  <input type='submit' value='Execute'/>
 </li>
 </ul>
</form>
<pre>
args = '$args'
proc = '$proc'
result = '$result'
Log:
[join $::punycode::log \n]

proc ::punycode::$proc {[info args ::punycode::$proc]} {[info body ::punycode::$proc]}
</pre>
</body>
</html>"
