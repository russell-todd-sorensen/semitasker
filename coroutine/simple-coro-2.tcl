source coroutine-library.tcl;

proc Suspend {coroVar args} {
    upvar 1 $coroVar __Main
    upvar 1 args parentArgs
    set __Main [lindex $parentArgs 0]
    puts $__Main
    uplevel 1 yield {*}$args
}

proc MainRoutine {varName} {
    upvar 1 $varName __Main
    set __Main [info coroutine]
}

proc Detach {args} {
    if {[llength $args] > 0} {
        set __Main [lindex $args 0]
        uplevel 1 yieldto $__Main {*}[lrange $args 1 end]
    } else {
        uplevel 1 yield
    }
}


proc CoA {args} {

    Suspend MainRoutine;

    puts -nonewline "A1 ";
    Resume B;
    puts -nonewline "A2 ";
    Resume B;
    puts -nonewline "A3 ";

    Detach $MainRoutine;
}

proc CoB {args} {

    Suspend MainRoutine;

    puts -nonewline "B1 ";
    Resume A;
    puts -nonewline "B2 ";
    Resume A;
    puts -nonewline "B3 ";

    Detach $MainRoutine;
}


proc MainProgram {} {

    MainRoutine MainRoutine;

    coroutine A CoA $MainRoutine;
    coroutine B CoB $MainRoutine;

    Resume A;

    puts "STOP ";
    flush stdout;

}

coroutine Main MainProgram;
