set n 10

set statusCounter 0
set status($statusCounter) [exec grep "Size" /proc/self/status]
set thousandChars [string repeat "a" 1000]
for {set i 0} {$i < $n} {incr i} {
    set interp($i) [interp create child$i]
    set char($i) $thousandChars
    incr statusCounter
    set status($statusCounter) [exec grep "Size" /proc/self/status]
}


incr statusCounter
set status($statusCounter) [exec grep "Size" /proc/self/status]

foreach i [lsort -integer -increasing [array names status]] {
    puts "Size at $i : \n$status($i)"
}

