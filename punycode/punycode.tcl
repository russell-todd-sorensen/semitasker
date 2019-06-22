

if {[namespace exists ::punycode]} {
    namespace delete ::punycode
}

namespace eval ::punycode {
    variable log [list]
    variable log_level 6
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
    variable log_levels {
        {0 "Log Everything"}
        {1 "Log Details"}
        {2 "Log Notices"}
        {3 "Log Warnings"} 
        {4 "Log Traces"}
        {5 "Log Errors"} 
        {6 "Log Nothing"}
    }
}

proc ::punycode::buildSelect { } {

    variable log_level
    variable log_levels
    set select [list]
    set selected ""

    foreach level_list $log_levels {
        lassign $level_list level_value level_name
        if {$log_level eq $level_value} {
            set selected " selected"
        } else {
            set selected ""
        }
        lappend select "<option value='$level_value'$selected>$level_name</option>"
    }
    return $select 
}

namespace eval ::punycode {
    variable Table
    variable hexChars [split "0123456789ABCDEF" ""]

    for {set i 0} {$i < 7} {incr i} {
        set Table($i) [expr int(pow(16,$i))]
    }
}

proc ::punycode::toDecimal { char } {
    scan $char %c
}

# Returns minimum 4 hex digits left padded with 0's

proc ::punycode::toHex {decimalNumber} {
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

    if {$result eq ""} {
        set result "0"
    }
    return "[string repeat "0" [expr 4-[string length $result]]]$result"
}

proc ::punycode::log { level args } {
    variable log
    variable log_level

    if {$level - $log_level >= 0} {
        lappend log "[join $args " "]"
    }
}

namespace eval ::punycode {

    set i 0
    foreach cpt [split $code_points_lc ""] {
        set digit_value($cpt) $i
        set digit_value([toHex [toDecimal $cpt]]) $i
        incr i
    }
    set i 0
    foreach cpt [split $code_points_uc ""] {
        set digit_value($cpt) $i
        set digit_value([toHex [toDecimal $cpt]]) $i
        incr i
    }
    unset i
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

    log 4 "n is $n, i is $i, bias is $bias"
    log 2 "State &lt;n,i&gt; = <$n,$i> bias is $bias"
    log 4 "input is \"$a_label\""

    set output ""

    set last_delimiter_index [string last "-" $a_label]

    log 1 "last_delimiter_index = $last_delimiter_index"

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
        log 5 "ERROR non_basic_cp_error count = $non_basic_cp_error"
        return -code error "ERROR non_basic_cp_error count = $non_basic_cp_error"
    }

    if {$basic_code_points > 0} {
        set a_label [string range $a_label [expr $last_delimiter_index + 1] end]
    }

    if {$output == ""} {
        log 4 "there is no delimiter, so extended string starts empty"
    } else {
        log 4 "literal portion is $output, so extended string starts as"
        set lp [list] 
        foreach char [split $output ""] {
            lappend lp [::punycode::toHex [::punycode::toDecimal $char]]
        }
        log 4 [join $lp " "]
    }

    set input_length [string length $a_label]
    set out [string length $output]

    for {set in 0} {$in < $input_length} { } {
        set delta_string ""
        for {set oldi $i; set w 1; set k $base} {true} {incr k $base} {
            log 1 "i = $i oldi = $oldi"

            if {$in >= $input_length} {
                log 5 "Bad Input in=$in input_length=$input_length"
                return -code error "Bad Input in=$in input_length=$input_length"
            }

            set code_point [string index $a_label $in]
            log 2 "input code_point = '$code_point' in=$in"
            append delta_string $code_point            
            set digit [decode_digit $code_point]
            incr in
            if {$digit >= $base} {
                log 5 "bad input digit=$digit >= base=$base"
                return -code error "bad input digit=$digit >= base=$base"
            }
            #if {$digit > ($maxint - $i) / $w} {
               # return -code error "code_point error, code point='$code_point' digit=\
                 #'$digit' has no value output='$output' a_label='$a_label'"
            #}
            set i [expr {($i) + ($digit * $w)}]

            log 1 "(i = $i digit=$digit w=$w) digit*w = [expr $digit * $w] new i = i+digit*w = [expr {$i + ($digit * $w)}]"

            if {[is_overflow $i]} {
                log 5 "overflow error i = '$i' on code_point '$code_point'"
                return -code error "overflow error i = '$i' on code_point '$code_point'"
            }

            if {$k <= $bias} {
                set t $tmin
            } elseif {$k >= ($bias + $tmax) } {
                set t $tmax
            } else {
                set t [expr {$k - $bias}]
            }

            log 2 "t = $t k = $k bias = $bias, bias+tmax = [expr $bias + $tmax] k-bias = [expr $k - $bias]"

            if {$digit < $t} {
                log 1 "Breaking on digit $digit < t $t"
                break
            }

            set w [expr {$w * ($base - $t)}]

            if {[is_overflow $w]} {
                log 5 "overflow error on w = '$w'"
                return -code error "overflow error on w = '$w'"
            }
        }

        log 4 "delta \"$delta_string\" decodes to [expr $i - $oldi]"

        set bias [adapt \
            [expr {$i - $oldi}] \
            [expr {$out + 1}] \
            [expr {$oldi == 0}] ]

        log 4 "bias becomes $bias"

        log 3 "State &lt;n,i&gt; = <$n,$i>"

        set n [expr {$n + (int($i) / int($out + 1))}]

        if {[is_overflow $n]} {
            log 5 "overflow on n = '$n'"
            return -code error "overflow on n = '$n'"
        }

        set i [expr {$i % int($out + 1)}]

        if {[is_basic_code_point $n]} {
            log 5 "Error n = '$n' is basic_code_point"
            return -code error "Error n = '$n' is basic_code_point"
        }

        log 3 "inserting n=$n char=[format %c $n] uni=u+[toHex $n] at position i=$i"

        set output_list [split $output ""]
        set output [join [linsert $output_list $i [format %c $n]] ""]
        set out [string length $output]
        incr i

        formatAsHex $output $i

        log 1 "for i = '$i' output = '$output' a_label= '$a_label' n = '$n'"
    }

    log 1  "while i = '$i' output = '$output' a_label= '$a_label'"

    return $output
}


proc ::punycode::formatAsHex { output i} {
    
    set chout [list]

    foreach ch [split $output ""] {
        lappend chout [toHex [toDecimal $ch]]
    }

    log 4 [linsert $chout $i *]
}

# returns list of unicode code points 
proc ::punycode::formatAsUnicode { u_label {length 9}} {
    set unicode [list]
    set uniline ""
    set i 1
    set lines 0
    foreach cp [split $u_label ""] {
        if {[string is upper $cp]} {
            set u U
        } else {
            set u u
        }
        set ucp ${u}+[format %0.4X [scan $cp %c]]
        append uniline "$ucp "
        
        if {($i % $length) == 0} {
            lappend unicode $uniline
            set uniline ""
            incr lines
        }
        incr i
    }
    if {$lines == [llength $unicode]} {
        lappend unicode $uniline
    }
    return $unicode
}


proc ::punycode::basic { cp } {
    expr {[scan $cp %c] < [scan 0x80 %x]}
}

proc ::punycode::encode { u_label {output_length 63}} {
    variable initial_n
    variable initial_bias
    variable maxint ;# 26 bits
    variable base
    variable tmin
    variable tmax
    variable skew

    set n $initial_n
    set bias $initial_bias
    set delta 0
    set out 0
    set input_length [string length $u_label]
    set max_out $output_length

    log 4 "bias is $bias"
    log 4 "input is:"

    formatAsHex $u_label end

    set output ""

    for {set j 0} {$j < $input_length} {incr j} {
        set cp [string index $u_label $j]
        if {[basic $cp]} {
            if {$max_out - $out < 2} {
                log 5 "Punycode Big Output"
                return -code error "Punycode Big Output"
            }
            append output $cp
            incr out
        }
    }

    set h $out ;# number of code points that have been handled
    set b $out ;# b is number of basic code points out is num output

    if {$b > 0} {
        set bcpts [list]
        foreach cpt [split $output ""] {
            lappend bcpts [toHex [toDecimal $cpt]]
        }
        append output "-"
        log 4 "basic code points ([join $bcpts ", "]) are copied to literal portion: \"$output\""
    } else {
        log 4 "there are no basic code points, so no literal portion"
    }

    while {$h < $input_length} {
        # All non-basic code points < n have been
        # handled already, Find next larger one:

        for {set m $maxint; set j 0} {$j < $input_length} {incr j} {
            set cp [string index $u_label $j]
            set val [toDecimal $cp]
            if {$val >= $n  && $val < $m} {
                set m $val
                log 1 "  m set to $val ([toHex $val])"
            }
        }
        log 4 "next code point to insert is [toHex $m]"
        # Increase delta enough to advance the decoder's
        # <n,i> state to <m,0>, but guard against overflow

        if {$m - $n > ($maxint - $delta) / ($h + 1)} {
            return -code error "Punycode overflow"
        }

        set delta [expr {$delta + ($m - $n) * ($h + 1)}]
        set n $m

        for {set j 0} {$j < $input_length} {incr j} {
            set cp [string index $u_label $j]
            set val [toDecimal $cp]
            if {$val < $n} {
                if {[incr delta] == 0} {
                    return -code error "Punycode overflow"
                }
            }
            
            if {$val == $n} {
                set accumulated_output ""
                # represent delta as a generalized variable length integer:
                for {set q $delta; set k $base} {true} {incr k $base} {
                    if {$out >= $max_out} {
                        return -code error "Punycode Big Output"
                    }
                    if {$k <= $bias} {
                        set t $tmin
                    } elseif {$k >= $bias + $tmax} {
                        set t $tmax
                    } else {
                        set t [expr {$k - $bias}]
                    }
                    if {$q < $t} {
                        break
                    }
                    set outputCode [encode_digit [expr {$t + ($q - $t)%($base - $t)}] 0]
                    append output $outputCode
                    append accumulated_output $outputCode
                    set q [expr {int(($q - $t) / ($base - $t))}]
                }
                set outputCode [encode_digit $q 0]
                append output $outputCode
                append accumulated_output $outputCode
                log 4 "needed delta is $delta, encodes as \"$accumulated_output\""
                set bias [adapt $delta [expr {$h + 1}] [expr {$h == $b}]]
                log 4 "bias becomes $bias"
                set delta 0
                incr h
            }
        }

        incr delta
        incr n
    }
    set output_length $out
    log 4 "output is \"$output\""
    return $output
}

proc ::punycode::encode_digit { d {flag 0}} {
    if {$flag != 0} {
        set flag 1
    }
    set val [expr { $d + 22 + 75 * ($d < 26) - (($flag != 0) << 5)}]
    return [format %c $val]
    #  0..25 map to ASCII a..z or A..Z
    # 26..35 map to ASCII 0..9
}