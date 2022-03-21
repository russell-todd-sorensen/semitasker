set myHorses [list 1 2 3 4 5 6 7 8 9]
set heatMax 3
set winners 3
set result [list]


proc runMeet {horses max winners} {
    upvar 1 $horses h 
    upvar 1 $max m
    
}

while {[llength $myHorses]}  {
    set heat [runHeat $myHorses $maxHeat]
    puts "$horse [llength $myHorses]"
}

