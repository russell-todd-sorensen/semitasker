proc "%" {args} {
    uplevel 1 {*}$args
}
proc "@" {args} {
    puts $args
}
set l [list a b c d e f g]
@ a b c d e f g
% lset l 5 end [lindex $l end]
@ a b c d e g g
set l [list a b c d e f g]
@ a b c d e f g
% lset l {5 1} [lindex $l end]
@ a b c d e {f g} g
% lset l {4 1} [lindex $l end-1]
@ a b c d {e {f g}} {f g} g
% lset l {3 1} [lindex $l end -2]
@ a b c {d {}} {e {f g}} {f g} g
set l [list a b c d {e {f g}} {f g} g]
@ a b c d {e {f g}} {f g} g
% lset l {3 1} [lindex $l end-2]
@ a b c {d {e {f g}}} {e {f g}} {f g} g
% lset l {2 1} [lindex $l end-3]
@ a b {c {d {e {f g}}}} {d {e {f g}}} {e {f g}} {f g} g
% lset l {1 1} [lindex $l end-4]
@ a {b {c {d {e {f g}}}}} {c {d {e {f g}}}} {d {e {f g}}} {e {f g}} {f g} g
% set f [lrange $l 0 1]
@ a {b {c {d {e {f g}}}}}
