# Force into global namespace

namespace eval :: {

proc "--" {var {val 1}} {
    upvar $var __V
    incr __V [expr {-1*$val}]
}
#or
proc decr {var {val 1}} {
    upvar 1 $var __V 
    set __V [expr {-1*$val+$__V}]
}
 
proc Resume {who args} {
    uplevel 1 yieldto $who $args
}

proc Call {who args} {
    uplevel 1 $who {*}$args
}

proc Detach {args} {
    uplevel 1 yield $args
}

proc Log {level args} {
    puts stderr "$level -> [join $args " "]";
}

proc Sequencing { args } {
    uplevel 1 coroutine Main {*}$args;
}

proc SequencingDelux {mc args} {
    uplevel 1 coroutine $mc {*}$args;
    Call $mc {*}$args;
}

proc SequencingDeluxNS {ns mc args} {
    uplevel 1 coroutine ${ns}::$mc {*}$args;
    Call ${ns}::$mc {*}$args;
}

# separates namespace arg into separate var
proc SequencingNS {ns mc mt args} {
    uplevel 1 coroutine ${ns}::$mc ${ns}::${mt} {*}$args;
    Call ${ns}::$mc {*}$args;
}

proc Coro {name args} {
    uplevel 1 coroutine $name {*}$args
}

proc Pause {} {
    uplevel 1 Detach [info coroutine]
}

proc Shared {args} {
    if {[llength $args] == 2} {
        uplevel 1 [list variable {*}$args]
    } else {
        uplevel 1 variable [lindex $args 0]
    }
}

proc Share {list} {
    if {[llength $list]} {
        foreach {varName value} $list {
            uplevel 1 [list variable $varName $value]
        }
    }
}

}

proc ::coroNextId {} {
    set id 0;
    Pause;
    while {true} {
        Detach $id;
        incr id;
    }
}

coroutine nextId ::coroNextId