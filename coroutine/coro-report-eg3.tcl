source coroutine-library.tcl;

namespace eval ::cororpt {

    proc CoA {} {
        Pause;
        puts -nonewline stdout "A1 ";
        Resume B;
        puts -nonewline stdout "A2 ";
        Resume B;
        puts -nonewline stdout "A3 ";
    }

    proc CoB {} {
        Pause;
        puts -nonewline stdout "B1 ";
        Resume A;
        puts -nonewline stdout "B2 ";
        Resume A;
        puts -nonewline stdout "B3 ";
    }

    proc MainProgram {} {
        Coro B CoB;
        Coro A CoA;
        Resume A;
        puts stdout "STOP ";
    }

    SequencingNS [namespace current] Main MainProgram;
}
