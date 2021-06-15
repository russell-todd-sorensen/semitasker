set problem {
    # Enter problem description, exactly started
    Google 25 Horses Question:
    Find best way to determine top 3 horses, without
    a stopwatch and only racing 5 horses at a time:
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.

SEE BELOW FOR FIRST SOLUTION 

But this page will use a different idea:

Still trippple elimination, but each horse gets partially
eliminated for finishing second place or worse. When
The total gets above the number of top horses to return,
they are eliminated completely.

With this idea, assume for a sec that you are only allowed
to race the number of horses to return, so no leverage as 
calculated below.

Twenty-Five horses race in heats of at most 3.

Results of first round. A round is defined by every horse,
or their proxy (previous heat winner) running:

Heat, labels:
                                                                                                  Remaining:
A1,A2,A3  (0,1,2)                            (2,3,4)  (A2,A3 elim)             (4) (A1 elim)      
B1,B2,B3  (0,1,2)                            (0,1,2)  (No Change)              (2,3,4) (B2,B3 elim) (2)   (B1)
C1,C2,C3  (0,1,2)                            (1,2,3)  (C3 elim)                (3,4)  (C1,C2 elim) 
                    J1,J2,J3 (from B1,C1,A1) (0,1,2)-^

D1,D2,D3  (0,1,2)                            (1,2,3) (D3 elim)                 (2,3) (D2 elim)      (2)
E1,E2,E3  (0,1,2)                            (2,3,4) (E2,E3 elim)              (3)   (E1 elim)
F1,F2,F3  (0,1,2)                            (0,1,2) (No Change)               (1,2,3) (F3 elim)    (1,2) (F1)    ()
                    K1,K2,K3 (from F1,D1,E1) (0,1,2)-^
                   

G1,G2,G3  (0,1,2)                            (1,2,3) (G3 elim)                 (1,2) (No Change)    (1,2) 
H1,H2     (0,1)                              (0,1)   (No Change)               (0,1) (No Change)    (0,1)
I1,I2     (0,1)                              (2,3)   (I2 elim)                 (2)   (No Change)    (2)         N1,N2,N3 (from G1,H2,I1) -> G1 rep     
                    L1,L2,L3 (from H1,G1,I1) (0,1,2)-^
                                                            M1,M2,M3 (from H1,F1,B1)-^
                                                                                            H1 promo                                                P1,P2,P3  (from G1,F1,B1) 
                                                                         
Result: (H1,G1,F1)                                      

Race    Start simple
1       5 -> 3
2       5 -> 3
3       5 -> 3
4       5 -> 3
5       5 -> 3
        ------
6           5 -> 3
7           5 -> 3
8           5 -> 3
            ------
9               5 -> 3
10              4 -> 3
                ------
11                  4 -> top  3
12                  2 -> pass 2
                    -----------
13                            5 -> 3

Maybe trippple elimination:

A    5 -> A1,A2,A3
B    5 -> B1,B2,B3
C    5 -> C1,C2,C3
D    5 -> D1,D2,D3
E    5 -> E1,E2,E3

F (A1,B1,C1,D1,E1) =>  (F1,F2,F3)
(Eliminate All in eliminated groups) 
 Example D1 and E1 finish 4 and 5
 Eliminate D2,D3 and E2,E3  

So pool of horses = A1,A2,A3 B1,B2,B3 C1,C2,C3 (9 remaining -- actually 8)

A1,B1,C1 are thru 2nd round Now A1F1,B1F2,C1F3

But A1F1 is the fastest horse, promote to finished:
Fastest: A1F1

Race G 
G (A2,B2,C2,B1F2,C1F3)  G1 (A2G1) is second fastest horse, eliminate  
SecondFastest: A2G1 

Left: B2G2 C2G3 A3 B3 C3

Race H 
H (B2G2,C2G3,A3,B3,C3)

Winner becomes last of three: 8 Races.

Lets try to code this up.

}

if {[namespace exists ::horse::race]} {
    namespace delete ::horse::race
}

namespace eval ::horse::race {

    variable horses
    variable heats 
    variable raceHeatLetters "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    variable heatIndex 0


    proc init {{logName log}} {
        initLog $logName
    }

    proc rec {logName what} {
        variable $logName
        lappend $logName $what
    }

    proc initLog {logName} {
        variable $logName [list]
    }

    proc printLog {logName {joinBy \n} {reset 0}} {
        variable $logName
        set result [join [set $logName] $joinBy]
        if {$reset} {
            set $logName [list]
        }
        return $result
    }
    proc getHeats {} {
        variable heats
        return $heats
    }
    proc nextHeatName {} {
        variable raceHeatLetters 
        variable heatIndex
        
        set heatName [string index $raceHeatLetters $heatIndex]
        incr heatIndex

        return $heatName
    }

    proc findTopHorses {n h t {min 1} {max 100}} {
        variable numHorses $n 
        variable maxHeat $h 
        variable numTop $t
        stats::setRacingTimesMinMax $min $max
        stats::initHorses $numHorses
        variable horseNames [stats::getHorses]
        variable heats

        createRandomRaceHeats

    }

    proc createRandomRaceHeats {{minHeat 2}} {
        variable maxHeat 
        variable horseNames
        variable heats
    
        while {[llength $horseNames] >= $minHeat} {
            set heatName [nextHeatName]
            for {set i 0} {$i < $maxHeat && [llength $horseNames]>0} {incr i} {
                set index [expr {int(floor([ns_rand]*[llength $horseNames]))}]
                lappend $heatName [lindex $horseNames $index]
                set horseNames [lremove $horseNames $index] 
            }
            lappend heats [list $heatName [set $heatName]]
        }
    }
}

namespace eval ::horse::race::stats {

    proc rec {logName what} {
        variable $logName
        lappend $logName $what
    }

    proc initLog {logName} {
        variable $logName [list]
    }

    proc printLog {logName {joinBy \n} {reset 0}} {
        variable $logName
        set result [join [set $logName] $joinBy]
        if {$reset} {
            set $logName [list]
        }
        return $result
    }

    proc initHorses {{howMany 25} {prefix H}} {
        variable horse
        set format "${prefix}%0.[string length $howMany]i"

        for {set i 0} {$i < $howMany} {incr i} {
            set key [format $format $i]
            set horse($key) [list $i $key 0]
        }
    }

    proc setRacingTimesMinMax {{min 1} {max 100} } {
        variable minTime $min 
        variable maxTime $max
    }

    proc getHorses {} {
        variable horse
        return [array names horse]
    }

    proc raceGroup {horseNameList} {
        variable horse
        variable minTime
        variable maxTime
        set horses [list]
        foreach h $horseNameList {
            set time [lindex $horse($h) end]
            if {$time eq "0"} {
                set  time [expr {(int(($minTime+[ns_rand]*$maxTime)*100))/100.0}]
                lset horse($h) end $time
            }
            lappend horses $horse($h)
        }

        set sorted [lsort -real -increasing -index end $horses]
        set results [list]

        foreach h $sorted {
            lappend results [lindex $h 1]
        }

        return $results
    }

}



set numHorsesDefault 25
set maxHorsesPerHeat  5
set topFinishers      3

set form [ns_conn form]
set n [ns_set get $form n $numHorsesDefault]
set h [ns_set get $form h $maxHorsesPerHeat]
set t [ns_set get $form t $topFinishers]

set result [::horse::race::findTopHorses $n $h $t]
set horses [::horse::race::stats::getHorses]
set heats [::horse::race::getHeats]
set result2 [list]

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Google 25 Horses Question</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='n'>Number of Horses competing</label>
  <input name='n' id='n'  value='$n'>
 </li>
 <li>
  <label for='h'>Max horses per heat</label>
  <input name='h' id='h' value='$h'>
 </li>
 <li>
  <label for='t'>Number of top horses</label>
  <input name='t' id='t' value='$t'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?4'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
Number of Horses to race = '$n'
Max Horses per Heat = '$h'
Return Top '$t' horses.
result ='$result'
All Heats: 
[join $result2 "\n"]
heats = '
[join $heats "\n"]'
horses = '
[join $horses "\n"]'
</pre>
</body>
</html>"
