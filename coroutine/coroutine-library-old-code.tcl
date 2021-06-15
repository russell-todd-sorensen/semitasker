# Force into global namespace

namespace eval :: {


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

proc SequencingDelux {mainCoro args} {
    set ns [uplevel 1 namespace current]
    puts stderr "SequencingDelux ns=$ns"
    set finalizeId [Call nextId]
    proc ${ns}::finalSequencing$finalizeId {mainCoro} {
        puts stderr "pausing in finalSequencing.. coro=[info coroutine]"
        Pause;
        Resume $mainCoro;
    }

    uplevel 1 coroutine ${ns}::f$finalizeId ${ns}::finalSequencing$finalizeId ${ns}::$mainCoro;
    uplevel 1 coroutine ${ns}::$mainCoro {*}$args;
    Call ${ns}::f$finalizeId;
    puts stdout "finalizeId=$finalizeId mainCoro=$mainCoro";
}

proc SequencingDelux2 {ns mainCoro args} {
    #set ns [uplevel 1 namespace current]
    puts stderr "SequencingDelux ns=$ns"
    set finalizeId [Call nextId]
    proc ${ns}::finalSequencing$finalizeId {mainCoro} {
        puts stderr "pausing in finalSequencing.. coro=[info coroutine]"
        Pause;
        Resume $mainCoro;
    }

    uplevel 1 coroutine ${ns}::f$finalizeId ${ns}::finalSequencing$finalizeId ${ns}::$mainCoro;
    uplevel 1 coroutine ${ns}::$mainCoro {*}$args;
    puts stderr "started main waiting to call ${ns}::f$finalizeId"
    Call ${ns}::f$finalizeId;
    puts stdout "finalizeId=$finalizeId mainCoro=$mainCoro";
}

proc SequencingDelux4 {ns mc args} {
    uplevel 1 coroutine ${ns}::$mc {*}$args;
    Call ${ns}::$mc;
}

proc Sequencing { args } {
    uplevel 1 coroutine Main {*}$args;
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