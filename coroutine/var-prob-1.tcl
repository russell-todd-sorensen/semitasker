source coroutine-library.tcl;

# This version of Shared handles initialization
# of the variable to the empty string.

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


namespace eval ::ns1 {
    Shared a 10
    Shared b 2
    Shared c 3
    Shared d ""

    proc p1 { } {
        Shared a

        puts $a
    }

    proc p2 { } {
        variable a
        puts $a
    }
}

# Initilize all variables with one Call
# form is same as [array get]
namespace eval ::ns2 {
    Share { a 10
            b 2
            c 3
            d
        }

    proc p1 { } {
        Shared a

        puts $a
    }

    proc p2 { } {
        variable a
        puts $a
    }
}


puts "info vars ::ns2::* ='[info vars ::ns2::*]'"

puts "::ns1::p1 = '[::ns1::p1]'"
puts "::ns2::p1 = '[::ns2::p1]'"
puts "::ns1::p2 = '[::ns1::p2]'"
puts "::ns2::p2 = '[::ns2::p2]'"
