source coroutine-library.tcl;

proc Sequencing { coro } {
    coroutine Main $coro
}

namespace eval ::MyCoroutines {

    proc CoroA {} {

        set count 0;

        while {"True"} {
            Detach A[incr count];
        }
    }

    proc CoroB {} {

        set counter 0;

        while {"True"} {
            Detach B[incr counter];
        }
    }

    proc MainCoroutine {} {

        puts [coroutine A CoroA];
        puts [coroutine B CoroB];

        set decider -1
        while {"True"} {
            if {[incr decider] % 2} {
                set result [Resume A]
            } else {
                set result [Resume B]
            }

            puts -->$result;
            if {[string length $result] > 2} {
                Detach "The End"
            } else {
                puts "$result is [string length $result] chars long."
            }
        }
    }

    set initialResult [Sequencing ::MyCoroutines::MainCoroutine]

    puts "initialResult=$initialResult"

}
