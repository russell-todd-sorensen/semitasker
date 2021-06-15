
if {[llength [info proc deleteInterp]] == 0} {
    proc deleteInterp {alias} {
        if {[interp exists $alias]} {
            interp delete $alias
        }
    }
}

deleteInterp recurse

set myInterp [interp create recurse]
# ns_atclose deleteInterp $myInterp

interp eval $myInterp {

    global log
    set log [list]

    proc rec {logName what} {
        global $logName
        lappend $logName $what
    }

    proc init {} {
        global log
        set log [list]
    }

    proc printLog {logName {joinBy \n} {reset 0}} {
        global $logName
        set result [join [set $logName] $joinBy]
        if {$reset} {
            set $logName [list]
        }
        return $result
    }

    proc poorlyDesignedRecursiveProc {n max} {
        if {$n <= 0} {
            rec log "n=$n, returning"
            return 0
        }
        if {$n >= $max} { 
            # stop recursion
            rec log "n=$n >= max ($max)"
            return 0
        }
        rec log "n=$n"
        expr {$n + [poorlyDesignedRecursiveProc [expr {$n-1}] $max]}
    }
}

set m 10
set n 2
set defaultMax 1000
set max 5000

#set form [ns_conn form]
#set n [ns_set get $form n $n]
#set m [ns_set get $form m $defaultMax]

if {$m > $max} {
    set m $max
}

# raise upper limit on recursive calls
try {
    interp recursionlimit $myInterp $m

    set result [$myInterp eval poorlyDesignedRecursiveProc $n $m]
    set logs [$myInterp eval printLog log]
    puts stdout "
m = $m 
n = $n 
defaultMax = $defaultMax 
max = $max 
result = $result 
logs = $logs"
} on error { errorTrace optionList} {
    global errorInfo 
    puts stderr "$errorText \n $errorInfo"
}