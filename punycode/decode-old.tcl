set problem {
    # Enter problem description, exactly started
6.2 Decoding procedure

   let n = initial_n
   let i = 0
   let bias = initial_bias
   let output = an empty string indexed from 0
   consume all code points before the last delimiter (if there is one)
     and copy them to output, fail on any non-basic code point
   if more than zero code points were consumed then consume one more
     (which will be the last delimiter)
   while the input is not exhausted do begin
     let oldi = i
     let w = 1
     for k = base to infinity in steps of base do begin
       consume a code point, or fail if there was none to consume
       let digit = the code point's digit-value, fail if it has none
       let i = i + digit * w, fail on overflow
       let t = tmin if k <= bias {+ tmin}, or
               tmax if k >= bias + tmax, or k - bias otherwise
       if digit < t then break
       let w = w * (base - t), fail on overflow
     end
     let bias = adapt(i - oldi, length(output) + 1, test oldi is 0?)
     let n = n + i div (length(output) + 1), fail on overflow
     let i = i mod (length(output) + 1)
     {if n is a basic code point then fail}
     insert n into output at position i
     increment i
   end

   The full statement enclosed in braces (checking whether n is a basic
   code point) can be omitted if initial_n exceeds all basic code points
   (which is true for Punycode), because n is never less than initial_n.

   In the assignment of t, where t is clamped to the range tmin through
   tmax, "+ tmin" can always be omitted.  This makes the clamping
   calculation incorrect when bias < k < bias + tmin, but that cannot
   happen because of the way bias is computed and because of the
   constraints on the parameters.

   Because the decoder state can only advance monotonically, and there
   is only one representation of any delta, there is therefore only one
   encoded string that can represent a given sequence of integers.  The
   only error conditions are invalid code points, unexpected end-of-
   input, overflow, and basic code points encoded using deltas instead
   of appearing literally.  If the decoder fails on these errors as
   shown above, then it cannot produce the same output for two distinct
   inputs.  Without this property it would have been necessary to re-
   encode the output and verify that it matches the input in order to
   guarantee the uniqueness of the encoding.
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
    variable  digit_value
    info exists digit_value($char)
}

proc ::punycode::is_basic_code_point { char } {
    variable basic_code_points
    expr {[string first $char $basic_code_points] > -1 ? true : false}
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
        set delta [expr {int($delta / 2)}]
    }

    set delta [expr {$delta + int($delta / $numpoints)}]

    set k 0
    while {$delta > int((($base - $tmin) * $tmax) / 2)} {
        set delta [expr {int($delta / ($base - $tmin))}]
        incr k $base
    }

   return [expr {$k + int((($base - $tmin + 1) * $delta) / ($delta + $skew))}]
}

proc ::punycode::is_overflow { x } {
    return false
}

#       xn--n5gcsb.ws == ↈↀↁↇ.ws
# xn--abc-su1ag1bb.ws == ↈaↀbↁcↇ.ws
proc ::punycode::decode { a_label } {

    variable initial_n
    variable initial_bias
    variable digit_value
    variable base
    variable tmin
    variable tmax
    variable log

    set n $initial_n
    set i 0
    set bias $initial_bias
    set output ""

    set last_delimiter_index [string last "-" $a_label]

    set non_basic_cp_error 0
    set basic_code_points 0
    set error_code_points [list]
    foreach code_point [lrange [split $a_label ""] 0 [expr {$last_delimiter_index - 1}]] {
        if {[is_valid_code_point $code_point]} {
            append output $code_point
            incr basic_code_points
        } else {
            incr non_basic_cp_error
            lappend error_code_points $code_point
        }
    }

    if {$non_basic_cp_error > 0} {
        return -code error "ERROR non_basic_cp_error count = $non_basic_cp_error"
    }

    if {$basic_code_points > 0} {
        set a_label [string range $a_label [expr $last_delimiter_index + 1] end]
    }

    lappend log "starting output='$output' a_label='$a_label'"

    set input_length [string length $a_label]
    set out [string length $output]

    for {set in 0} {$in < $input_length} { incr out } {

        for {set oldi $i; set w 1; set k $base} {$k > 0} {incr k $base} {
            if {$in >= $input_length} {
                return -code error "Bad Input in=$in input_length=$input_length"
            }
            set code_point [string index $a_label $in]
            lappend log "input code_point = '$code_point' in=$in"
            set digit $digit_value($code_point)
            incr in
            if {$digit >= $base} {
                return -code error "bad input digit=$digit >= base=$base"
            }
            #if {$digit > ($maxint - $i) / $w} {
               # return -code error "code_point error, code point='$code_point' digit=\
                 #'$digit' has no value output='$output' a_label='$a_label'"
            #}
            set i [expr {$i + ($digit * $w)}]
            if {[is_overflow $i]} {
                return -code error "overflow error i = '$i' on code_point '$code_point'"
            }
            if {$k <= $bias} {
                set t $tmin
            } elseif {$k >= ($bias + $tmax) } {
                set t $tmax
            } else {
                set t [expr {$k - $bias}]
            }
            if {$digit < $t} {
                break
            }
            set w [expr {$w * ($base - $t)}]
            if {[is_overflow $w]} {
                return -code error "overflow error on w = '$w'"
            }
        }
        set bias [adapt \
            [expr {$i - $oldi}] \
            [expr {$out + 1}] \
            [expr {$oldi == 0}] ]

        set n [expr {$n + int($i / ($out + 1))}]
        if {[is_overflow $n]} {
            return -code error "overflow on n = '$n'"
        }
        set i [expr {$i % ($out + 1)}]
        if {[is_basic_code_point $n]} {
            return -code error "Error n = '$n' is basic_code_point"
        }
        lappend log "inserting n=$n char=[format %c $n] uni=u+[format %0.4X $n] at position i=$i"
        set output "[string range $output 0 [expr {$i - 1}]][format %c $n][string range $output $i end]"
        incr i
        lappend log "for i = '$i' output = '$output' a_label= '$a_label' n = '$n'"
    }
    lappend log  "while i = '$i' output = '$output' a_label= '$a_label'"

    return $output
}

set a_label_modified "abc-su1ag1bb"

set form [ns_conn form]
set a_label_modified [ns_set get $form a $a_label_modified]
if {[catch {
    set result [::punycode::decode $a_label_modified]
    set ok 1
} err]} {
    global errorInfo
    set result $errorInfo
    set ok 0
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
  <label for='a'>Ascii Label</label>
  <input name='a' id='a' value='$a_label_modified'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<pre>
a_label_modified = '$a_label_modified'
result = '$result'
[join $::punycode::log \n]

</pre>
</body>
</html>"
