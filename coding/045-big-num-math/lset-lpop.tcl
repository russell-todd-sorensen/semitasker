# https://www.tcl.tk/man/tcl8.7/TclCmd/lpop.html
# https://www.tcl.tk/man/tcl8.7/TclCmd/lset.html
proc "%" {args} {
    uplevel 1 $args
}
proc "@" {args} {
    puts $args
}

% set l [list a b c d e f g h]
@ a b c d e f g h
% lset l {end 1} [lpop l]
@ a b c d e f {g h}
% lset l {end 1} [lpop l]
@ a b c d e {f {g h}}
% lset l {end 1} [lpop l]
@ a b c d {e {f {g h}}}
% lset l {end 1} [lpop l]
@ a b c {d {e {f {g h}}}}
% lset l {end 1} [lpop l]
@ a b {c {d {e {f {g h}}}}}
% lset l {end 1} [lpop l]
@ a {b {c {d {e {f {g h}}}}}}

% set l
@ a {b {c {d {e {f {g h}}}}}}
% tcl::unsupported::representation $l
@ value is a list with a refcount of 2, object pointer at 0xffffffffa7a09f80, internal representation 0xffffffffa7a9e5a0:0x0, string representation "a {b {c {d {e..."
% tcl::unsupported::representation [lindex $l 1]
@ value is a list with a refcount of 2, object pointer at 0xffffffffa7a09ce0, internal representation 0xffffffffa7a9e920:0x0, string representation "b {c {d {e {f..."
% tcl::unsupported::representation [lindex $l 1 1]
@ value is a list with a refcount of 2, object pointer at 0xffffffffa7a09d70, internal representation 0xffffffffa7a9e8a0:0x0, string representation "c {d {e {f {g..."
%