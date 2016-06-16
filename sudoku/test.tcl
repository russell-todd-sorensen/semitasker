
proc ::decodeUrlEncodedData { urlData  } {

    set map [list + " "]
    for {set i 1} {$i < 16} {incr i} {
	lappend map %0[format %x $i] "[format %c $i]"
	lappend map %0[format %X $i] "[format %c $i]"

	puts "$i = [format %c $i]"
    }

    for {set i 16} {$i < 256} {incr i} {
	lappend map %[format %x $i] "[format %c $i]"
	lappend map %[format %X $i] "[format %c $i]"
	puts "$i = [format %c $i]"
    }
    puts "map = $map"
    return [string map $map $urlData]
    
}

foreach string {
    abc%20def+xyz
    {200 500 000
300 002 600
000 300 087

603 200 090
002 030 800
070 006 502

160 004 000
008 100 009
	000 003 008}
} {
    puts "$string == decoded ( [::decodeUrlEncodedData $string] )"
}