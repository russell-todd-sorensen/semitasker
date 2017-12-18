source coroutine-library.tcl;

namespace eval ::MyCoroutines {

    Shared Result;

    proc CoroX {} {

        Shared Result "";
        set count 0;

        Pause;

        while {"True"} {
            append Result [namespace tail [info coroutine]][incr count]
            Detach $Result;
        }
    }

    proc MainCoroutine {} {

        Shared Result;

        Coro A CoroX;
        Coro B CoroX;

        Pause;

        set Index 0

        while {"True"} {
            if {[incr Index] % 2} {
                Resume A
            } else {
                Resume B
            }

            if {[string length $Result] > 20} {
                return $Result
            }
        }
    }

    set ProgramName [Sequencing MainCoroutine]
}

set Main $::MyCoroutines::ProgramName
$Main
