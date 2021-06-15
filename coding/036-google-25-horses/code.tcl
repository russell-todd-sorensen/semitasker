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

set statsInterp stats 
set raceInterp  race 


if {[llength [info proc deleteInterp]] == 0} {
    proc deleteInterp {alias} {
        if {[interp exists $alias]} {
            interp delete $alias
        }
    }
}

deleteInterp statsInterp 
deleteInterp raceInterp

set raceInterp [interp create $raceInterp]
set statsInterp [interp create $statsInterp]

ns_atclose deleteInterp $raceInterp
ns_atclose deleteInterp $statsInterp


interp eval $statsInterp {

    global log
    set log [list]

    proc rec {logName what} {
        global $logName
        lappend $logName $what
    }

    proc init {} {
        global log
        set log [list]
    }

    proc printLog {logName {joinBy \n} {reset 0}} {
        global $logName
        set result [join [set $logName] $joinBy]
        if {$reset} {
            set $logName [list]
        }
        return $result
    }

    proc initHorses { {howMany 25} {prefix H} {arrayName horse} } {
        upvar 1 $arrayName horse
        set format "${prefix}%0.[string length $howMany]i"
        for {set i 0} {$i < $howMany} {incr i} {
            set key [format $format $i]
            set horse($key) [list $i $key 0]
        }
    }

    proc racingTimesMinMax {{minTime 1} {maxTime 100} } {
        upvar min _min
        upvar max _max
        set _min $minTime
        set _max $maxTime
    }
    proc getHorses {{arrayName horse}} {
        upvar $arrayName horse
        return [array names horse]
    }

    proc raceGroup {horseNameList {arrayName horse}} {
        upvar $arrayName horse
        set horses [list]
        foreach h $horseNameList {
            set time [lindex $horse($h) end]
            if {$time eq "0"} {
                set  time [expr {int(($min+[ns_rand]*$max)*100)/100}]
                lset horse($h) [list $idx $key $time]
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

interp eval $raceInterp {

    global log
    set log [list]

    proc rec {logName what} {
        global $logName
        lappend $logName $what
    }

    proc init {} {
        global log
        set log [list]
    }

    proc printLog {logName {joinBy \n} {reset 0}} {
        global $logName
        set result [join [set $logName] $joinBy]
        if {$reset} {
            set $logName [list]
        }
        return $result
    }

    proc getStatInterp {} {

    }
    proc initRaceInterp {statInterpName} {
        global statInterp $statInterpName
    }
    proc findTopHorses {{totalHorses 25} {maxPerRace 5}} {
        set horses 
    }

}





set a todo
set b todo

set form [ns_conn form]
set a [ns_set get $form a $a]
set b [ns_set get $form b $b]

set result [illuminatingProcName $a $b]

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Fill In Something Useful</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='b'>Input List</label>
  <input name='b' id='b'  value='$b'>
 </li>
 <li>
  <label for='a'>Target (k)</label>
  <input name='a' id='a' value='$a'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
a = '$a'
b = '$b'
</pre>
</body>
</html>"
