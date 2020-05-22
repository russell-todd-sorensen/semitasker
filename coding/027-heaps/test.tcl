
namespace eval ::rec {
    variable data ;# an array
}

proc ::rec::new {name} {
    variable data
    set ns [uplevel namespace current]
    
    set data(${ns}::$name) [list]
    proc ${ns}::$name [list what {args ""}] "
        variable data
        set name $name
        set ns $ns
        lappend data(${ns}::$name) \"\$what \$args\"
    " 
}

namespace eval ::heap {
    variable heap
    variable initialized 0
    variable trace 0
    variable size 0
    variable recName log
    ::rec::new log
}

proc ::heap::init {}  {
    variable heap
    variable initialized
    variable size

    if {!$initialized} {
        set heap [list]
        set size 0
    }
    log "finished ::heap::init"
    set initialized 1
}

::heap::init