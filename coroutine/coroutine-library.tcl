
proc Resume {what args} {
    uplevel 1 yieldto $what {*}$args
}

proc Call {what args} {
    uplevel 1 $what {*}$args
}

proc Detach {args} {
    uplevel 1 yield {*}$args
}

proc Log {level args} {
    puts stderr "$level -> [join $args " "]";
}
