set problem {
    #demonstrate usage of tcl interp for safe computing
}

set solution {
    # Mostly interested in using interp to change the recursion limit
    # for massively recursive procedures.
    # The current built in limit is 1000.
}

if {[llength [info proc deleteInterp]] == 0} {
    proc deleteInterp {alias} {
        if {[interp exists $alias]} {
            interp delete $alias
        }
    }
}

deleteInterp recurse

set myInterp [interp create recurse]
ns_atclose deleteInterp $myInterp

interp eval $myInterp {

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
    namespace eval ::fib {
        variable fibSequence [list 0 1]
        namespace import -force ::log::*
        init
        new log
        #Fibonacci Sequence 0,1,1,2,3,5
        proc f {nList {d 200}} {
            variable fibSequence
            set results [list]
            foreach n $nList {
                switch -exact -- $n {
                    0 - 1 {
                        lappend results $n
                        continue
                    }
                    default {
                        set i [expr [llength $fibSequence] -1]
                    
                        for {} {$i<$n} {incr i} {
                            lappend fibSequence [expr {[lindex $fibSequence end-1]+[lindex $fibSequence end]}]
                            rec log "got d=$d, i=$i, fibSequence=$fibSequence"
                        }
                        lappend results [lindex $fibSequence $n]
                        continue
                    }
                }
            }
            return $results
        }
    }
}

set n 2
set defaultMax 20
set max 1000
set fibDepth 200

set form [ns_conn form]
set n [ns_set get $form n $n]
set m [ns_set get $form m $defaultMax]

if {$m > $max} {
    set m $max
}

# raise upper limit on recursive calls
try {
    interp recursionlimit $myInterp $m
    set result [$myInterp eval [list ::fib::f $n $fibDepth]]
    set logs [$myInterp eval ::fib::print log]
    set recursions [interp recursionlimit $myInterp]
    set htmlPage [::wtk::ttt::applyTemplateNS code]
    ns_return 200 text/html [lindex $htmlPage end]
} on error {errorTrace optionList} {
    global errorInfo
    set logs "noneyet"
    catch {set logs [$myInterp eval ::fib::print log]}
    append errorInfo "\n--logs=$logs--"
    set errorText [ns_adp_parse -file [ns_url2file /services/return-code/500/internal-server-error.adp]]
    ns_return 500 text/html $errorText
}