source coroutine-library.tcl;

namespace eval ::testInfoCoroutine {
    proc testInfoCoroutine {} {

        puts [info coroutine]
    }

    coroutine tic testInfoCoroutine

}
