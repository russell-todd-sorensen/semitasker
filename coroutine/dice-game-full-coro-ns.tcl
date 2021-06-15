source coroutine-library.tcl;

namespace eval ::dice {
    
    variable numPlayers 0;
    variable winningScore 100;

    proc Player {id} {
        variable numPlayers;
        variable winningScore;
        
        set order $numPlayers;
        incr numPlayers;
        set Sum 0;
        puts stdout "Created $id"
        Pause;
        set next "P[expr {($order + 1)%$numPlayers}]"

        while {[incr Sum [expr {int(ceil(rand()*6))}]] < $winningScore} {
            Resume $next
        }
        puts stdout "The winner is player $id";
    }

    proc Game {players} {
        variable numPlayers 0
        for {set i 0} {$i < $players} {incr i} {
            set id "P$i"
            Coro $id Player $id
        }
        Resume P0

        foreach proc [info procs "[namespace current]::P?"] {
            puts stdout "Cleaning up $proc"
            rename $proc ""
        }
        puts stdout "Finished"
    }
    SequencingNS ::dice Main Game 6
}