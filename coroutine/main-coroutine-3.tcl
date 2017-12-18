source coroutine-library.tcl;

namespace eval ::MyCoroutines {

    Shared Result;

    proc CoroX {} {

        Shared Result "";
        set count 0;

        Detach;

        while {"True"} {
            set Result [namespace tail [info coroutine]][incr count]
            Detach;
        }
    }


    proc MainCoroutine {} {

        Shared Result;

        coroutine A CoroX;
        coroutine B CoroX;

        set Index -1

        Detach [info coroutine];

        while {"True"} {
            if {[incr Index] % 2} {
                Resume A
            } else {
                Resume B
            }

            if {[string length $Result] > 2} {
                return $Result
            } else {
                Detach $Result
            }
        }
    }

    set ProgramName [Sequencing ::MyCoroutines::MainCoroutine]


}

$::MyCoroutines::ProgramName
