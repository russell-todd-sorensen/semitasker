# Coroutines in tcl

proc nextnum {} {
    set i 0
    yield $i
    while {"True"} {
        yield [incr i]
    }
    puts "Should Never Reach Here"
}

coroutine mycoro nextnum


while {[set result [mycoro]] < 10} {
    puts $result
}


proc Resume {what args} {
    uplevel 1 yieldto $what {*}$args
}

proc Call {what args} {
    uplevel 1 $what {*}$args
}
