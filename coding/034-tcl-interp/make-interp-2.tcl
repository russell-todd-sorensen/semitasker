# try to figure out interp mem footprint
if {[namespace exists ::interp]} {
    namespace delete ::interp 
}

namespace eval ::interp {
    proc var {__name args} {
        uplevel variable $__name {*}$args
    }
    proc varArray {__name args} {
        #uplevel variable $__name 
        variable $__name 
        if {[llength $args]} {
            array set $__name $args
        }
    }

    var sample  10
    var count   10
    varArray status data [list] counter 0 oneKchars [string repeat "a" 1] ;#for testing
    varArray interps

    proc getStatus {key} {
        var status
        return $status($key)
    }
    proc setStatus {key val} {
        var status
        expr {[info exists status($key)] ? $status($key) : ""}
    }
    proc create { 
        {startInt 1} {numToCreate 10} {template "child%5.5d"} {interpCode ""} 
    } {
        var status 
        var interps
        var sample
        set len [llength $status(data)]

        if {$len >= $startInt} {
            set startInt $len
        }

        set end [expr {$startInt + $numToCreate }]
        for {set i $startInt} {$i < $end} {incr i} {
            set interps($i) [interp create [format $template $i]]
            if {($i % $sample) == 0} {
                lappend status(data) [list $i [exec grep "Size" /proc/self/status]]
            }
        }
    }
}

if {[llength [info commands "ns_conn"]]} {
    set form [ns_conn form]
    set ::interp::count [ns_set get $form ic $::interp::count]

} else {
    set tmpNum ""
    while {![string is integer -strict $tmpNum]} {
        if {$tmpNum == -1} {
            return -code return
        }
        puts stdout "Enter Number of Interps to create or -1 to exit: "
        set tmpNum [string trim [gets stdin]]
    }
    set ::interp::count $tmpNum
}

::interp::create 1 $::interp::count

if {[llength [info commands "ns_return"]]} {
    ns_return 200 text/plain [array get ::interp::status]
} else {
    puts done
}

if {0} {
    set statusCounter 0
    set status($statusCounter) [exec grep "Size" /proc/self/status]
    set thousandChars [string repeat "a" 1000]

    for {set i 0} {$i < $n} {incr i} {
        set interp($i) [interp create child$i]
        set char($i) $thousandChars
        incr statusCounter
        set status($statusCounter) [exec grep "Size" /proc/self/status]
    }
}
#
#incr statusCounter
#set status($statusCounter) [exec grep "Size" /proc/self/status]

#foreach i [lsort -integer -increasing [array names status]] {
#    puts "Size at $i : \n$status($i)"
#}

