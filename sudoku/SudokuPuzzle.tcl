if {![array exists URL]} {
    array set URL $conn(URL)
}

set queryString $URL(query-)

array set queryArray [list d 0 p 0100 bc 2 br 1 bm ""]

::wtk::log::log Notice "....queryString = '$queryString'"

::wtk::form::parseQueryToArray $queryString queryArray

proc ::decodeUrlEncodedData { urlData  } {

    set map [list + " "]
    for {set i 1} {$i < 16} {incr i} {
	lappend map %0[format %x $i] "[format %c $i]"
	lappend map %0[format %X $i] "[format %c $i]"

	#puts "$i = [format %c $i]"
    }

    for {set i 16} {$i < 256} {incr i} {
	lappend map %[format %x $i] "[format %c $i]"
	lappend map %[format %X $i] "[format %c $i]"
	#puts "$i = [format %c $i]"
    }
    #puts "map = $map"
    return [string map $map $urlData]
}

if {[info exists queryArray(p)]} {
    set p E[join [::decodeUrlEncodedData $queryArray(p)] ""]P
    set boxCols $queryArray(bc)
    set boxRows $queryArray(br)
    set boxMapString E[join [::decodeUrlEncodedData $queryArray(bm)] ""]P
} else {
    set p E200500000300002600000300087603200090002030800070006502160004000008100009000003008P
    set boxCols 3
    set boxRows 3
    set boxMapString E$queryArray(bm)P0
}

set showDefault $queryArray(d)

::wtk::log::log Notice "......query: [array get queryArray]"

::t3::respond $connId SudokuPuzzle text/html 200