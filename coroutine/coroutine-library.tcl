
proc Resume {what args} {
    uplevel 1 yieldto $what $args
}

proc Call {what args} {
    uplevel 1 $what {*}$args
}

proc Detach {args} {
    uplevel 1 yield $args
}

proc Log {level args} {
    puts stderr "$level -> [join $args " "]";
}

proc Sequencing { args } {
    uplevel 1 coroutine Main {*}$args
}

proc Coro {name args} {
    uplevel 1 coroutine $name {*}$args
}

proc Pause {} {
    uplevel 1 Detach [info coroutine]
}

proc Shared {args} {
    if {[llength $args] == 2} {
        uplevel 1 [list variable {*}$args]
    } else {
        uplevel 1 variable [lindex $args 0]
    }
}

proc Share {list} {
    if {[llength $list]} {
        foreach {varName value} $list {
            uplevel 1 [list variable $varName $value]
        }
    }
}
