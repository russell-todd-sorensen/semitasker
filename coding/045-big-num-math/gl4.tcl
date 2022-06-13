namespace eval ::Meet {
    variable meets ;# an array
    variable counter 0

    proc meetId {} {
        variable meets
        variable counter
        while {[array exists meets([set id "meet[incr counter]"])]} {} 
        return $id
    }

    proc new {numHorses maxHeat numPlaces {prune true}} {
        variable meets
        variable counter
        set nextId [meetId]
        set newNamespace [namespace current]::$nextId
        namespace eval $newNamespace {
            variable id
            variable index
            variable numHorses
            variable maxHeat
            variable numPlaces
            variable horses
            variable prune
            variable heats
            variable numCompared 0
            variable winners [list]
            variable remainingPlaces
            variable Queue [list]
            variable finalHeat false
        }
        set ${newNamespace}::numHorses $numHorses
        set ${newNamespace}::maxHeat $maxHeat
        set ${newNamespace}::numPlaces $numPlaces
        set ${newNamespace}::prune $prune
        set ${newNamespace}::heats [list]
        set ${newNamespace}::id $nextId 
        set ${newNamespace}::index $counter
        set ${newNamespace}::remainingPlaces $numPlaces

        set meets($nextId) $newNamespace
    }

    proc initHorses {meet} {
        set ns [namespace current]::$meet
        apply [list {} {
            variable numHorses
            variable Queue
            variable id

            for {set i 1} {$i <= $numHorses} {incr i} {
                set horseId "h$i" 
                namespace eval [namespace current]::$horseId {
                    variable horseId
                    variable time 
                    variable followers [list]
                }
                set ${horseId}::horseId $horseId
                set ${horseId}::time [expr {$numHorses*100*rand()}]
                lappend Queue ${id}::$horseId
            }
        } $ns]
    }

    proc compareHorses {a b} {
        set a [lindex $a 0]
        set b [lindex $b 0]
        set ns [namespace current]
        set timeA [set ${ns}::${a}::time] 
        set timeB [set ${ns}::${b}::time]
        set meetNS [namespace parent ${ns}::${a}]
        incr ${meetNS}::numCompared
        set val [expr {
            ($timeA < $timeB) ? -1 :
            ($timeA > $timeB) ?  1 :
            ($a lt $b) ? -1 : 1}]
        puts "compareHorses a='$a' AND b='$b' timeA='$timeA',timeB='$timeB' val='$val'"
        return $val
    }
    proc runHeat {heat} {
        variable runHeatLambda
        lsort -command [namespace current]::compareHorses $heat
    }

    variable makeHeatLambda {
        variable Queue
        variable maxHeat
        variable heats

        if {[llength $Queue] >= $maxHeat} {
            set heat [lrange $Queue end-[expr {$maxHeat-1}] end]
            set Queue [lrange $Queue 0 end-$maxHeat]
        } else {
            set heat $Queue
            set Queue [list]
        }
        puts "makeHeat heat='$heat' length='[llength $heat]'"
        puts "makeHeat Queue='$Queue' length='[llength $Queue]'"
        return $heat
    }
    proc makeHeat {ns} {
        # maybe I should recalc ns here?
        variable makeHeatLambda
        apply [list {} $makeHeatLambda $ns]
    }
    variable linkHeatLambda {
        variable prune
        variable numPlaces
        variable winners

        upvar $sName s
        if {$prune} {
            set pruneToIdx [expr {$numPlaces - [llength $winners]}]
        } else {
            set pruneToIdx -1
        }
        if {
            ($pruneToIdx > -1)
            && (([llength $s] - $pruneToIdx) >= 1)
        } {
            puts "Pruning to [expr {1+$pruneToIdx}] from [llength $s]"
            set s [lrange $s 0 $pruneToIdx]
        }
        puts "linkHeat ns=[namespace current]"
        for {set j $pruneToIdx} {$j > 0} {incr j -1} {
            set next [lindex $s $j-1]
            set last [lindex $s $j]
            lappend [namespace tail ${next}]::followers $last
        }

        #while {[llength $s] > 0} {
            #set ldr [lpop s]
            #lappend ldr::followers $end
            #set end [lpop s]
            #lset s {end end end+1} [lpop s]
        #}
        unset s
    }
    proc runMeet {meet} {
        set ns [namespace current]::$meet
        apply [list {} {
            variable id
            variable index
            variable numHorses
            variable maxHeat
            variable numPlaces
            variable horses
            variable prune
            variable heats 0
            variable numCompared
            variable winners
            variable remainingPlaces
            variable Queue
            variable finalHeat

            while {[llength $winners] < $numPlaces} {
                while {[llength $Queue]} {
                    set heat [[namespace parent]::makeHeat [namespace current]]
                    puts $heat
                    set res  [[namespace parent]::runHeat $heat]
                    puts $res
                
                    puts "heats = '$heats'"
                    incr heats 1
                    puts "heats = '$heats'"

                    if {$finalHeat} {
                        set idx 0 
                        while {$idx < $remainingPlaces} {
                            lappend winners [lindex $res $idx 0 0]
                            incr idx
                        }
                        break
                    }

                    puts "res='$res'"
                    apply [list {sName} $::Meet::linkHeatLambda [namespace current]] res
                    puts "res='$res'"
                    if {[llength $Queue]} {
                        puts "adding '[lindex $res 0]' to Queue"
                        set Queue [linsert $Queue 0 [lindex $res 0 0]]
                    } else {
                        lappend winners [lindex $res 0 0]
                        incr remainingPlaces -1
                        puts "winners now='$winners'"
                        if {[llength $winners] >= $numPlaces} {
                            break
                        }
                        set followers [lindex $res 0 1] 
                        if {[llength $followers] >= $remainingPlaces} {
                            set finalHeat true
                        }
                        if {[llength $followers]} {
                            set Queue [linsert $Queue 0 {*}$followers]
                            puts "Queue len [llength $Queue] now '$Queue'"
                        } else {
                            return $winners
                        }
                    }
                }
            }
        return $winners
        } $ns]
    }
}


global errorInfo
#::Meet::new 25 5 3
set meetName [namespace tail [::Meet::new 25 5 3]]
::Meet::initHorses $meetName
 