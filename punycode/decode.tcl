set problem {
    # Enter problem description, exactly started

}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
    6.3 Encoding procedure

   let n = initial_n
   let delta = 0
   let bias = initial_bias
   let h = b = the number of basic code points in the input
   copy them to the output in order, followed by a delimiter if b > 0
   {if the input contains a non-basic code point < n then fail}
   while h < length(input) do begin
     let m = the minimum {non-basic} code point >= n in the input
     let delta = delta + (m - n) * (h + 1), fail on overflow
     let n = m
     for each code point c in the input (in order) do begin
       if c < n {or c is basic} then increment delta, fail on overflow
       if c == n then begin
         let q = delta
         for k = base to infinity in steps of base do begin
           let t = tmin if k <= bias {+ tmin}, or
                   tmax if k >= bias + tmax, or k - bias otherwise
           if q < t then break
           output the code point for digit t + ((q - t) mod (base - t))
           let q = (q - t) div (base - t)
         end
         output the code point for digit q
         let bias = adapt(delta, h + 1, test h equals b?)
         let delta = 0
         increment h
       end
     end
     increment delta and n
   end

   The full statement enclosed in braces (checking whether the input
   contains a non-basic code point less than n) can be omitted if all
   code points less than initial_n are basic code points (which is true
   for Punycode if code points are unsigned).

   The brace-enclosed conditions "non-basic" and "or c is basic" can be
   omitted if initial_n exceeds all basic code points (which is true for
   Punycode), because the code point being tested is never less than
   initial_n.

   In the assignment of t, where t is clamped to the range tmin through
   tmax, "+ tmin" can always be omitted.  This makes the clamping
   calculation incorrect when bias < k < bias + tmin, but that cannot
   happen because of the way bias is computed and because of the
   constraints on the parameters.

   The checks for overflow are necessary to avoid producing invalid
   output when the input contains very large values or is very long.

   The increment of delta at the bottom of the outer loop cannot
   overflow because delta < length(input) before the increment, and
   length(input) is already assumed to be representable.  The increment
   of n could overflow, but only if h == length(input), in which case
   the procedure is finished anyway.

6.4 Overflow handling

   For IDNA, 26-bit unsigned integers are sufficient to handle all valid
   IDNA labels without overflow, because any string that needed a 27-bit
   delta would have to exceed either the code point limit (0..10FFFF) or
   the label length limit (63 characters).  However, overflow handling
   is necessary because the inputs are not necessarily valid IDNA
   labels.

   If the programming language does not provide overflow detection, the
   following technique can be used.  Suppose A, B, and C are
   representable nonnegative integers and C is nonzero.  Then A + B
   overflows if and only if B > maxint - A, and A + (B * C) overflows if
   and only if B > (maxint - A) div C, where maxint is the greatest
   integer for which maxint + 1 cannot be represented.  Refer to
   appendix C "Punycode sample implementation" for demonstrations of
   this technique in the C language.

   The decoding and encoding algorithms shown in sections 6.2 and 6.3
   handle overflow by detecting it whenever it happens.  Another
   approach is to enforce limits on the inputs that prevent overflow
   from happening.  For example, if the encoder were to verify that no
   input code points exceed M and that the input length does not exceed
   L, then no delta could ever exceed (M - initial_n) * (L + 1), and
   hence no overflow could occur if integer variables were capable of
   representing values that large.  This prevention approach would
   impose more restrictions on the input than the detection approach
   does, but might be considered simpler in some programming languages.

   In theory, the decoder could use an analogous approach, limiting the
   number of digits in a variable-length integer (that is, limiting the
   number of iterations in the innermost loop).  However, the number of
   digits that suffice to represent a given delta can sometimes
   represent much larger deltas (because of the adaptation), and hence
   this approach would probably need integers wider than 32 bits.

   Yet another approach for the decoder is to allow overflow to occur,
   but to check the final output string by re-encoding it and comparing
   to the decoder input.  If and only if they do not match (using a
   case-insensitive ASCII comparison) overflow has occurred.  This
   delayed-detection approach would not impose any more restrictions on
   the input than the immediate-detection approach does, and might be
   considered simpler in some programming languages.

   In fact, if the decoder is used only inside the IDNA ToUnicode
   operation [IDNA], then it need not check for overflow at all, because
   ToUnicode performs a higher level re-encoding and comparison, and a
   mismatch has the same consequence as if the Punycode decoder had
   failed.

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
proc ::punycode::decode { a_label } {

    variable initial_n
    variable initial_bias
    variable digit_value
    variable base
    variable tmin
    variable tmax

    set n $initial_n
    set i 0
    set bias $initial_bias

    log 5 "n is $n, i is $i, bias is $bias"
    set output ""

    set last_delimiter_index [string last "-" $a_label]

    log 5 "last_delimiter_index = $last_delimiter_index"

    set non_basic_cp_error 0
    set basic_code_points 0
    set error_code_points [list]

    foreach code_point [lrange [split $a_label ""] 0 [expr {$last_delimiter_index - 1}]] {
        if {[is_valid_code_point $code_point] ||
            $code_point eq "-"
        } {
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

    log 5 "starting output='$output' a_label='$a_label'"

    set input_length [string length $a_label]
    set out [string length $output]

    for {set in 0} {$in < $input_length} { } {
        set delta_string ""
        for {set oldi $i; set w 1; set k $base} {$k > 0} {incr k $base} {
            log 5 "i = $i oldi = $oldi"
            if {$in >= $input_length} {
                return -code error "Bad Input in=$in input_length=$input_length"
            }
            set code_point [string index $a_label $in]
            log 5 "input code_point = '$code_point' in=$in"
            append delta_string $code_point
            #set digit $digit_value($code_point)
            set digit [decode_digit $code_point]
            incr in
            if {$digit >= $base} {
                return -code error "bad input digit=$digit >= base=$base"
            }
            #if {$digit > ($maxint - $i) / $w} {
               # return -code error "code_point error, code point='$code_point' digit=\
                 #'$digit' has no value output='$output' a_label='$a_label'"
            #}
            set i [expr {($i) + ($digit * $w)}]

            log 5 "(i = $i digit=$digit w=$w) digit*w = [expr $digit * $w] new i = i+digit*w = [expr {$i + ($digit * $w)}]"

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
            log 5 "t = $t k = $k bias = $bias, bias+tmax = [expr $bias + $tmax] k-bias = [expr $k - $bias]"
            if {$digit < $t} {
                log 5 "Breaking on digit $digit < t $t"
                break
            }
            set w [expr {$w * ($base - $t)}]
            if {[is_overflow $w]} {
                return -code error "overflow error on w = '$w'"
            }
        }

        log 4 "delta \"$delta_string\" decodes to $i"

        set bias [adapt \
            [expr {$i - $oldi}] \
            [expr {$out + 1}] \
            [expr {$oldi == 0}] ]

        log 4 "bias becomes $bias"
        set n [expr {$n + (int($i) / int($out + 1))}]
        if {[is_overflow $n]} {
            return -code error "overflow on n = '$n'"
        }

        set i [expr {$i % int($out + 1)}]
        if {[is_basic_code_point $n]} {
            return -code error "Error n = '$n' is basic_code_point"
        }
        log 5 "inserting n=$n char=[format %c $n] uni=u+[::hex::to $n] at position i=$i"
        set output_list [split $output ""]
        set output [join [linsert $output_list $i [format %c $n]] ""]
        #set output "[string range $output 0 [expr {$i - 1}]][format %c $n][string range $output $i end]"
        set out [string length $output]
        incr i
        set chout [list]
        foreach ch [split $output ""] {
            lappend chout [::hex::to [scan $ch %c]]
        }
        log 4 [linsert $chout $i *]
        log 5 "for i = '$i' output = '$output' a_label= '$a_label' n = '$n'"
    }
    log 5  "while i = '$i' output = '$output' a_label= '$a_label'"

    return $output
}

set a_label_modified "abc-su1ag1bb"
set log_level 0

set form [ns_conn form]
set a_label_modified [ns_set get $form a $a_label_modified]
set log_level [ns_set get $form l $log_level]

set ::punycode::log_level $log_level

if {[catch {
    set result [::punycode::decode $a_label_modified]
    set ok 1
} err]} {
    global errorInfo
    set result $errorInfo
    set ok 0
}

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
<title>Decode ASCII PunyCode Label</title>
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
<a href='encode.tcl?u=$result&l=5'>Encode $result</a>
<pre>
a_label_modified = '$a_label_modified'
result = '$result'
[join $::punycode::log \n]

[join $unicode \n]

</pre>
</body>
</html>"
