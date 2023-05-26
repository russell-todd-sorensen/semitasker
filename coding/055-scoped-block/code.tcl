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
        variable fibSequence2 [list]
        variable depth 0
        variable depth2 0
        namespace import -force ::log::*
        init
        new log
        #Fibonacci Sequence 0,1,1,2,3,5
        proc f {nList} {
            variable fibSequence
            variable depth
            set results [list]
            foreach n $nList {
                switch -exact -- $n {
                    0 - 1 {
                        lappend results $n
                        continue
                    }
                    default {
                        set i [expr [llength $fibSequence] -1]
                    
                        incr depth
                        for {} {$i<$n} {incr i} {
                            lappend fibSequence [expr {[lindex $fibSequence end-1]+[lindex $fibSequence end]}]
                            rec log "got n='$n' depth='$depth', i='$i', fibSequence='$fibSequence'"
                        }
                        lappend results [lindex $fibSequence $n]
                        continue
                    }
                }
            }
            return $results
        }
        proc initFibSeq2 {n} {
            variable fibSequence2
            if {[llength $fibSequence2]==0} {
                set fibSequence2 [lrepeat [expr {$n+1}] 0]
                lset fibSequence2 1 1
                rec log "initFibSeq2:fibSequence2 now $fibSequence2"
            }
        }
        proc f2 {n} {
            variable fibSequence2
            variable depth2
            if {[llength $fibSequence2]==0} {
                initFibSeq2 $n
            }
            incr depth2 1
            rec log "f2 depth2='$depth2' n='$n' level=[info level]"
            switch -exact -- $n {
                0 {
                    lset fibSequence2 0 0
                }
                1 {
                    lset fibSequence2 1 1
                }
                default {
                    if {[lindex $fibSequence2 $n]==0} {
                        lset fibSequence2 $n [expr [f2 [expr {$n-1}]]+[f2 [expr {$n-2}]]]
                    }
                }
            }
            #lappend fibSequence2 $val
            rec log "f2 n=$n, fibSequence2='$fibSequence2'"
            incr depth2 -1
            lindex $fibSequence2 $n
        }
    }
}

set n 2
set nmax 997
set d 20

set form [ns_conn form]
set n [ns_set get $form n $n]
if {$n > $nmax} {
    set n $nmax
}
set d [ns_set get $form d [expr {$n+3}]]
if {$d < $n+3} {
    set d [expr {$n+3}]
}

# raise upper limit on recursive calls
try {
    interp recursionlimit $myInterp $d
    set result [$myInterp eval [list ::fib::f $n]]
    set result2 [$myInterp eval [list ::fib::f2 $n]]
    set logs [$myInterp eval ::fib::print log]
    set recursions [$myInterp eval {set ::fib::depth}]
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