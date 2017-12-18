source coroutine-library.tcl;

proc Sequencing { coro } {
    coroutine Main $coro
}

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

        set decider -1

        Detach [info coroutine];

        while {"True"} {
            if {[incr decider] % 2} {
                Resume A
            } else {
                Resume B
            }

            puts Result=$Result;
            if {[string length $Result] > 2} {
                Detach {The End}
            } else {
                Detach "$Result is [string length $Result] chars long."
            }
        }
    }

    set ProgramName [Sequencing ::MyCoroutines::MainCoroutine]


}

$::MyCoroutines::ProgramName
