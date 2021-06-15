source coroutine-library.tcl;

namespace eval ::dice {
    
    variable numPlayers 0;
    variable winningScore 100;
    variable placed 0;

    proc Player {id} {
        variable numPlayers;
        variable winningScore;
        variable main;
        variable placed;
        
        set order $numPlayers;
        incr numPlayers;
        set Sum 0;
        #puts stdout "Created $id"
        Pause;
        set next "P[expr {($order + 1)%$numPlayers}]"

        while {[incr Sum [expr {int(ceil(rand()*6))}]] < $winningScore} {
            Resume $next
        }
        incr placed;

        puts -nonewline stdout "$id placed $placed with score ";
        Resume $main $id $next $Sum;
    }

    proc Game {players {wScore 100}} {
        variable numPlayers 0
        variable playerList [list]
        variable main [info coroutine]
        variable winningScore $wScore
        for {set i 0} {$i < $players} {incr i} {
            set id "P$i"
            Coro $id Player $id
            lappend playerList $id
        }

        set next [lindex $playerList 0]

        while {$numPlayers > 0} {
            set results [Resume $next]
            lassign $results id next sum
            set curr [lsearch -exact $playerList $id]
            set prev [expr {($curr -1)%$numPlayers}]
            coroprobe [lindex $playerList $prev] set next $next
            incr numPlayers -1
            set playerList [lremove $playerList $curr]
            lappend scores [list $id $sum]
            puts stdout $sum
        }
        Pause;
        puts stdout "$scores"
    }
    SequencingNS ::dice Main Game 6
}
