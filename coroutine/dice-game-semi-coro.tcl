source coroutine-library.tcl;

namespace eval ::dice {
    
    variable winningScore 100;

    proc Player {id} { 
        variable winningScore
        set Sum 0;
        puts stdout "initializing $id Sum=$Sum"
        Pause;

        while {true} {
            incr Sum [expr {int(ceil(rand()*6))}]
            Detach $Sum;
        }
    }

    proc Game {players} {
        variable winningScore
        for {set i 0} {$i <= $players} {incr i} {
            set id "P$i"
            Coro $id Player $id
        }
        set calls 0
        set index [expr {$calls%$players}]
        while {[set val [Call "P$index"]] < $winningScore} {
            incr calls
            puts stdout "P$index at $val after $calls calls"
            set index [expr {$calls%$players}]
        }
        puts stdout "coros: [info procs [namespace current]::P*]"
        puts stdout "coros: [info procs *P*]"
        puts stdout "The winner is P$index with total $val"
        puts stdout "Finished"
    }
    Sequencing Game 6
}