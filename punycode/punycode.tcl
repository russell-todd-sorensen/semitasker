
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
    set output ""

    for {set j 0} {$j < $input_length} {incr j} {
        set cp [string index $u_label $j]
        if {[basic $cp]} {
            if {$max_out - $out < 2} {
                return -code error "Punycode Big Output"
            }
            append output $cp
            incr out
        }
    }

    set h $out ;# number of code points that have been handled
    set b $out ;# b is number of basic code points out is num output

    if {$b > 0} {
        append output "-"
    }

    while {$h < $input_length} {
        # All non-basic code points < n have been
        # handled already, Find next larger one:

        for {set m $maxint; set j 0} {$j < $input_length} {incr j} {
            set cp [string index $u_label $j]
            set val [scan $cp %c]
            if {$val >= $n  && $val < $m} {
                set m $val
            }
        }

        # Increase delta enough to advance the decoder's
        # <n,i> state to <m,0>, but guard against overflow

        if {$m - $n > ($maxint - $delta) / ($h + 1)} {
            return -code error "Punycode overflow"
        }
        set delta [expr {$delta + ($m - $n) * ($h + 1)}]
        set n $m

        for {set j 0} {$j < $input_length} {incr j} {
            set cp [string index $u_label $j]
            set val [scan $cp %c]
            if {$val < $n} {
                if {[incr delta] == 0} {
                    return -code error "Punycode overflow"
                }
            }
            if {$val == $n} {
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
                    append output [encode_digit [expr {$t + ($q - $t)%($base - $t)}] 0]
                    set q [expr {int(($q - $t) / ($base - $t))}]
                }

                append output [encode_digit $q 0]
                set bias [adapt $delta [expr {$h + 1}] [expr {$h == $b}]]
                set delta 0
                incr h
            }
        }

        incr delta
        incr n
    }
    set output_length $out
    return $output
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

    expr {$k + int((($base - $tmin + 1) * $delta) / ($delta + $skew))}
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
    set output ""
    set last_delimiter_index [string last "-" $a_label]
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

    set input_length [string length $a_label]
    set out [string length $output]

    for {set in 0} {$in < $input_length} { } {
        set delta_string ""
        for {set oldi $i; set w 1; set k $base} {$k > 0} {incr k $base} {
            if {$in >= $input_length} {
                return -code error "Bad Input in=$in input_length=$input_length"
            }
            set code_point [string index $a_label $in]
            append delta_string $code_point
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
                log 5 "Breaking on digit $digit < t $t"
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

        set n [expr {$n + (int($i) / int($out + 1))}]

        if {[is_overflow $n]} {
            return -code error "overflow on n = '$n'"
        }

        set i [expr {$i % int($out + 1)}]

        if {[is_basic_code_point $n]} {
            return -code error "Error n = '$n' is basic_code_point"
        }

        set output_list [split $output ""]
        set output [join [linsert $output_list $i [format %c $n]] ""]
        set out [string length $output]
        incr i
    }

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