set list {r t c d e f g h}

proc compareHorses {a b} {
    set timeA [lindex $a 1]
    set timeB [lindex $b 1]
    set val [expr {
        ($timeA < $timeB) ? -1 :
        ($timeA > $timeB) ?  1 :
        ([lindex $a 0] < [lindex $b 0]) ? -1 : 1}]
    puts "compareHorses a='[lindex $a 0]' AND b='[lindex $b 0]' timeA='$timeA',timeB='$timeB' val='$val'"
    return $val
}

#puts "compare [list a .3] [list b .5] = '[compareHorses [list a .3] [list b .5]]'"


proc makeHeat {listName {max 3}} {
    upvar 1 $listName list
    if {[llength $list] >= $max} {
        set heat [lrange $list end-[expr {$max-1}] end]
        set list [lrange $list 0 end-$max]
    } else {
        set heat $list
        set list []
    }
 
    return $heat
}

proc assignRunTimes {h} {
        if {[llength [lindex $h 0]]==1} {
        
        set len [llength $h]
        for {set i 0} {$i<$len} {incr i} {
            set horse [lindex $h $i]
            set time [expr {$len*100*rand()}]
            lset h $i [list $horse $time {}]
        }
    }
    return $h
}

proc runHeat {h} {
    set sorted [lsort -command compareHorses $h]
}

proc linkHeatOLD {sName} {
    upvar $sName s
    while {[llength $s] > 1} {
        lset s {end end} [lpop s]
    }
}

proc linkHeat {sName} {
    upvar $sName s
    while {[llength $s] > 1} {
        lset s {end end end+1} [lpop s]
    }
}

proc linkHeat2OLD {sName} {
    upvar $sName s
    while {[llength $s] > 1} {
        lset s {end end+1} [lpop s]
    }
}

#set heat [makeHeat list $max]
#set res [runHeat $heat]
#linkHeat res
#lappend result1 [lindex $res 0]
#lappend winners [lrange [lindex $res 0] 0 1]
#puts "result1=$result1"

set horses25 [list a b c d e f g h i j k l m n o p q r s t u v w x y]


proc runMeet {horseListIn {maxHeat 3} {numPlaces 0}} {
    if {!$numPlaces} {
        set numPlaces [llength $horseListIn]
    }
    set horses [assignRunTimes $horseListIn]
    set winners [list]
    set bigloop 0
    set Queue $horses
    set heatCount 0

    while {[llength $winners] < $numPlaces} {
        while {[llength $Queue]} {
            set heat [makeHeat Queue $maxHeat]
            set res  [runHeat $heat]
            linkHeat res
            puts "Ran heat [incr heatCount]"
            if {[llength $Queue]} {
                puts "adding '[lindex $res 0]' to Queue"
                set Queue [linsert $Queue 0 [lindex $res 0]]
            } else {
                lappend winners [lrange [lindex $res 0] 0 1]
                puts "winners [incr bigloop] = '$winners'"
                if {[llength $winners] >= $numPlaces} {
                    break;
                }
                set followers [lindex $res 0 2]
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
}

set result [runMeet $list 3 3]

puts "\nresult=$result"