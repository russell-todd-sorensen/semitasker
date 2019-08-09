::twt::form::getQuery {
    {ttt "e o t c a t c i t"}
}

set Xcount [llength [lsearch -exact -all -inline $ttt X]]
set Ocount [llength [lsearch -exact -all -inline $ttt O]]

set step [expr $Xcount + $Ocount]

if {!($step % 2)} {
    set player X
    set watcher O
} else {
    set player O
    set watcher X
}

proc ::removeElement { array args } {
    upvar $array A
    foreach name $args {
        if {[info exists A($name)]} {
            unset A($name)
        }
    }
}

set winningVec "none"
set possibleWinList [list]

if {$step > 4} {

    # See if watcher is winner.

    set count 0

    foreach {x11 x12 x13 x21 x22 x23 x31 x32 x33} $ttt {break}
    
    array set possibleWins {
        arow1 1 arow2 1 arow3 1
        bcol1 1 bcol2 1 bcol3 1
        cross1 1 cross2 1
    }
    
    # Eliminate most possibile vectors with 4 checks
    if {$x11 ne $watcher} {
        ::removeElement possibleWins arow1 cross1 bcol1
    }
    if {$x13 ne $watcher} {
        ::removeElement possibleWins arow1 cross2 bcol3
    }
    if {$x23 ne $watcher} {
        ::removeElement possibleWins arow2 bcol3
    }
    if {$x32 ne $watcher} {
        ::removeElement possibleWins bcol2 arow3
    }

    # While any possibile winners remain, loop and eliminate. 
    # Exit when 
    #       winning vector is found 
    #   or when
    #       all possible winners are eliminated

    while {[llength [set possibleWinList [lsort [array names possibleWins]]]] > 0} {

        switch -exact [lindex $possibleWinList 0] {
            arow1 {
                if {$x12 eq $watcher} {
                    break
                } else {
                    ::removeElement possibleWins arow1 bcol2
                }
            }
            arow2 {
                if {$x22 eq $watcher} {
                    if {$x21 eq $watcher} {
                    break
                    } else {
                    ::removeElement possibleWins arow2 bcol1
                    }
                } else {
                    ::removeElement possibleWins arow2 bcol2 cross1 cross2
                }
            }
            arow3 {
                if {$x31 eq $watcher} {
                    if {$x33 eq $watcher} {
                        break
                    } else {
                        ::removeElement possibleWins arow3 bcol3 cross1
                    }
                } else {
                    ::removeElement possibleWins arow3 bcol1 cross2
                }
            }
            bcol1 {
            if {$x21 eq $watcher} {
                    if {$x31 eq $watcher} {
                    break
                    } else {
                    ::removeElement possibleWins bcol1 cross2
                    }
                } else {
                    ::removeElement possibleWins bcol1
                }
            }
            bcol2 {
                if {$x22 eq $watcher} {
                    if {$x12 eq $watcher} {
                    break
                    } else {
                    ::removeElement possibleWins  bcol2
                    }
                } else {
                    ::removeElement  possibleWins bcol2 cross1 cross2
                }
            }
            bcol3 {
                if {$x33 eq $watcher} {
                    break
                } else {
                    ::removeElement  possibleWins bcol3
                }
            }
            cross1 {
                if {$x22 eq $watcher} { 
                    if {$x33 eq $watcher} {
                        break
                    } else {
                        ::removeElement possibleWins cross1
                    }
                } else {
                    ::removeElement possibleWins cross1 cross2
                }
            }
            cross2 {
                if {$x22 eq $watcher} {
                    if {$x31 eq $watcher} {
                        break
                    } else {
                        ::removeElement possibleWins cross2
                    }
                } else {
                    ::removeElement possibleWins cross2
                }
            }
        }

        incr count
        if {$count > 8} {
            break
        }
    }

    if {[llength [set possibleWinList [lsort [array names possibleWins]]]] > 0} {
        set winningVec [lindex $possibleWinList 0]
    }
}

::resource::init
::resource::add reverse ::resource::reverse

::view::return