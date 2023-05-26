# reasons to skip sourcing the remaining file
while {true} {
    if {
        ([info command ns_set] == "")
        ||
        ([namespace exists ::jrnl])
       } {
        return -code return
    }
    break 
}

namespace eval ::log {
    variable journal
    variable domains [list]

    if {[array exists journal]} {
        array unset journal
    }

    proc new {name {lineFmt "%5.5d"} } {
        variable journal
        variable domains
        if {[info exists journal(name)]} {
            return $name
        } else {
            lappend domains $name
            set journal(${name}:fmt) $lineFmt
            set journal(${name}:count) 0
            rec $name "added new log named '$name'"
        }
    }
    proc rec {name what} {
        variable journal
        set fmt $journal(${name}:fmt)
        set journal(${name}:[format $fmt [incr journal(${name}:count)]]) $what
        puts "$name:[format $fmt $journal(${name}:count)] $what"
    }

    proc init {} {
        variable journal
    }

    proc print {name {keyGlob *} {joinBy \n} {reset 0}} {
        variable journal
        set lines [lsort -stride 2 [array get journal ${name}:$keyGlob]]
        set result [join $lines $joinBy]
        if {$reset} {
            set fmt $journal(${name}:fmt)
            array unset journal ${name}:$keyGlob
            set journal(${name}:fmt) $fmt
            set journal(${name}:count) 0
        }
        return $result
    }
    namespace export *
}
