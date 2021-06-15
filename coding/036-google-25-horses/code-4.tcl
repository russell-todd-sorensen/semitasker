set problem {
    # Enter problem description, exactly started
    Google 25 Horses Question:
    Find best way to determine top 3 horses, without
    a stopwatch and only racing 5 horses at a time:
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.

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
    variable raceHeatLetters "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    variable heatIndex 0
    variable raceHeats [list]

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

    proc findTopHorses2 {n h t {min 1} {max 100}} {

    }
    proc findTopHorses {n h t {min 1} {max 100}} {
        
        variable numHorses $n 
        variable maxHeat $h 
        variable numTop $t
        stats::setRacingTimesMinMax $min $max
        stats::initHorses $numHorses
        variable horseNames [stats::getHorses]
        variable raceHeats [createRandomRaceHeats $h [expr {$t+1}] ]
        variable heatIndex
        variable raceHeatLetters 
        variable roundOneHeatList
        variable roundTwoHeatList
        variable roundOneResults
        variable roundTwoResults


        ns_log Notice "raceHeats = $raceHeats"

        groupHorsesInitialHeats
        

        foreach heat $raceHeats {
            ns_log Notice "heat = $heat"
            lassign $heat heatLetter horseList
            lappend roundOneHeatList $heatLetter
            set roundOneResults($heatLetter) [stats::raceGroup $horseList]
        }

        set roundTwoHeatLetter [string index $raceHeatLetters $heatIndex]
        set roundTwoHeatList [list $roundTwoHeatLetter]
        incr heatIndex

        foreach heatLetter $roundOneHeatList {
            lappend roundTwoHorses [lindex $roundOneResults($heatLetter) 0]
        }
        lappend raceHeats [list $roundTwoHeatLetter $roundTwoHorses]
        set roundTwoResults($roundTwoHeatLetter) [stats::raceGroup $roundTwoHorses]
        return $roundTwoResults($roundTwoHeatLetter)


    }

    proc nextHeatName {} {
        variable raceHeatLetters 
        variable heatIndex
        
        set heatName [string index $raceHeatLetters $heatIndex]
        incr heatIndex

        return $heatName
    }

    proc groupHorsesInitialHeats { } {
        variable numHorses
        variable maxHeat
        variable numTop
        variable minHeat  [expr {$numTop+1}]
        variable leverage [expr {$maxHeat-$numTop}]
        variable horseNames
        variable horseGroups

        # Note: goal is to create fewist groups all larger than numTop

        if {$leverage < 1} {
            return -code error "No leverage to determine results."
        }
        set minPossibleGroups [expr {ceil(1.0*$numHorses/$maxHeat)}]
        set maxPossibleGroups [expr {ceil(1.0*$numHorses/$minHeat)}]
        if {$minPossibleGroups > $maxPossibleGroups } {
            return -code error "minPossible > maxPossible"
        }

        set fullGroups [expr {$numHorses/$maxHeat}]
        set remainder [expr {$numHorses%$maxHeat}]
        set groupSizes [lrepeat $fullGroups $maxHeat]
        lappend groupSizes $remainder

        if {$remainder > 0} {
            if {$remainder < $minHeat} {
                # see if we can pull some off full groups
                if {($leverage > 1)} {
                   
                    if {($remainder + $fullGroups) >= $minHeat} {
                        for {set i 0} {$i < ($minHeat-$remainder)} {incr i} {
                            lset groupSizes $i [expr {[lindex $groupSizes $i] - 1}]
                            lset groupSizes end [expr {[lindex $groupSizes end]+1}]
                        }
                    }
                } {

                }
            }
        }

        ns_log Notice "minPossibleGroups=$minPossibleGroups maxPossibleGroups=$maxPossibleGroups"

    }

    # Note: min heat size is one more than number of top horses to find
    proc createRandomRaceHeats {{heatSizeMax 5} {minHeatSize 4}} {
        variable raceHeats
        set horseNameList [stats::getHorses]
    
        while {[llength $horseNameList] > $minHeatSize} {
            set heatName [nextHeatName]
            for {set i 0} {$i < $heatSizeMax && [llength $horseNameList]>0} {incr i} {
                set index [expr {int(floor([ns_rand]*[llength $horseNameList]))}]
                lappend $heatName [lindex $horseNameList $index]
                set horseNameList [lremove $horseNameList $index] 
            }
            lappend raceHeats [list $heatName [set $heatName]]
        }
        return $raceHeats
    }
}

namespace eval ::horse::race::stats {

    variable horse ;# An Array of horse ids race times

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
set result2 [list]
foreach {let res} [lsort -stride 2 -index 0 [array get ::horse::race::roundOneResults]] {

    lappend result2 "$let = $res"
}
foreach {let res} [lsort -stride 2 -index 0 [array get ::horse::race::roundTwoResults]] {
    lappend result2 "$let = $::horse::race::roundTwoResults($let)"
}

set horseNames [lsort [array names ::horse::race::stats::horse]]

foreach name $horseNames {
    lappend horses [list $name $::horse::race::stats::horse($name)]
}

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
horses = '
[join $horses "\n"]'
</pre>
</body>
</html>"
