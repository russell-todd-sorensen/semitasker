source coroutine-library.tcl;

namespace eval ::testx {
    Shared X 10
    variable y

    proc a {} {
        Shared X
        puts $X
    }

    proc b {} {
        Shared X
        Detach $X
    }
}
