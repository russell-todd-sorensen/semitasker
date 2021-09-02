set problem {
    # Define Ackerman's Function using recursive procedure
    # Try to use memory to avoid recalculating already known
    # results
}

set solution {
    # The function requires a recursive procedure
    # Since Tcl is now stackless, this should work ok in tcl.
    #include <stdio.h>

    The following solution almost does away with the recursion,
    the software cannot calculate fn(4,2) == 2^(65533+3) -3
    There is another limit for fn(3,*)
    fn(3,1020) = 2^(1020+3)-3 = 89884656743115795386465259539451236680898848947115328636715040578866337902750481566354238661203768010560056939935696678829394884407208311246423715319737062188883946712432742638151109800623047059726541476042502884419075341171231440736956555270413618581675255342293149119973622969239858152417678164812112068605
    fn(4,2) is done in because fn(4,2) = fn(3,65533) == (2^(65533+3) - 3) (as above) 

    All of these can be calculated with at most one recursive entry from fn(4,*) to fn(3,*), 
    which can be calculated exactly, and actually you could extend this to infinity almost
    because fn(4,n) first calls fn(4,n-1), then fn(4,n-2)...

    Beyond this, if you start at fn(5,x) or fn(6,x) eventually recurse to fn(4,65533), Which requires a stack at 
    least 66k.
}

global log
global COUNTER c

set log [list]

proc rec {logName what} {
    global $logName
    lappend $logName $what
}

proc printLog {logName {joinBy \n} {reset 0}} {
    global $logName
    set result [join [set $logName] $joinBy]
    if {$reset} {
        set $logName [list]
    }
    return $result
}

if {[namespace exists ackermann]} {
    namespace delete ackermann
}

namespace eval ::ackermann {
    variable cache
    variable hits
    variable maxEntries 1000
    variable maxRecursions
    variable COUNTER 0
}

proc ::ackermann::fn {m n} {
    variable COUNTER
    variable maxRecursions
    variable cache
    variable hits
    variable maxEntries

    set cacheHits ""

    incr COUNTER

    if {[info exists hits($m,$n)]} {
        incr hits($m,$n)
        rec log "+cacheHits $m,$n = $hits($m,$n)"
        
        return $cache($m,$n)
    }

    rec log "B=[format %0.7d $COUNTER] ack($m,$n)"

    if {$COUNTER > $maxRecursions} {
        rec log "maxRecursions $maxRecursions reached m=$m, n=$n ans='not determined'"
        return 0
    }
    if {$m == 0} {
        rec log "Direct 0 cache --> ack(3,$n)"
        set cache($m,$n) [expr {$n + 1}]
        incr hits($m,$n)
        append cacheHits "+"

    } elseif {$m == 1} {
        rec log "Direct 1 cache --> ack(3,$n)"
        set cache(1,$n) [expr {$n + 2}]
        incr hits(1,$n)
        append cacheHits "+"

    } elseif {$m == 2} {
        rec log "Direct 2 cache --> ack(3,$n)"
        set cache(2,$n) [expr {2*($m+$n) - 1}]
        incr hits(2,$n)
        append cacheHits "+"
    } elseif {$m == 3} {
        if {![string is integer -strict $n]} {
            set base [lindex $n 0]
            set exp  [lindex $n 1]
            set int  [lindex $n 2]
            set exp2 [expr {$int + 3}] 
            set n+3  [list 2^ $exp $exp2]
            set n2   [list $base ${n+3} -3]
            rec log "Direct 3 cache --> ack(3,$n)"
            set cache(3,$n) $n2
            rec log "n+3 = '[set "n+3"]'"
        } elseif {$n > 1020} {
            # the next calculation will go bust, can I return it symbolically?
            rec log "Symb gt(3,1020) caching --> ack(3,$n)"
            set cache(3,$n) [list 2^ [expr {$n+3}] -3]
        } else {
            rec log "Symb lt(3,1019) caching --> ack(3,$n)"
            #set cache(3,$n) [expr {int(pow(2,$n+$m))-3}]
            #set cache(3,$n) [list 2 ^^ [expr $n+2] -3]  ;# (wrong!)
            set cache(3,$n) [list 2^ [expr $n+3] -3]
        }
        incr hits(3,$n)
        append cacheHits "+"

    } elseif {$n == 0} {
        set mt [expr {$m-1}]
        if {[info exists cache($mt,1)]} {
            incr hits($mt,1)
            rec log "cacheHits hits($mt,1) = $hits($mt,1)"
            return $cache($m1,1)
        }
        set cache($m,$n) [fn $mt 1]
        incr hits($m,$n)
        append cacheHits "+"
    } else {
        set mt [expr {$m-1}]
        set nt [expr {$n-1}]
        if {[info exists cache($m,$nt)]}  {
            set vt $cache($m,$nt)
            incr hits($m,$nt)
            append cacheHits "+"
        } else {
            set vt [fn $m $nt]
        }
        if {[info exists cache($mt,$vt)]} {
            set cache($m,$n) $cache($mt,$vt)
            incr hits($mt,$vt)
            append cacheHits "+"
        } else {
            rec log "Recurse Calc and cache--> ack($mt,$vt)"
            set cache($m,$n) [fn $mt $vt]
            incr hits($m,$n)
        }
    }

    rec log "E=[format %0.7d $COUNTER] ack($m,$n)=$cache($m,$n)$cacheHits"
    return $cache($m,$n)
}

proc ::ackermann::init {{c 10000} } {
    variable COUNTER 0
    variable maxRecursions $c
    variable cache
    variable hits
    variable maxEntries $c
}

set m 0
set n 0
set c 500000
set COUNTER 0

set form [ns_conn form]
set m [ns_set get $form m $m]
set n [ns_set get $form n $n]
set c [ns_set get $form c $c]

if {$c > 500000} {
    set c 500000
}

::ackermann::init $c

try {
    set result [::ackermann::fn $m $n]
} on error {e} {
    global errorInfo
    set result "error $e \n $errorInfo"
    if {[string length $result] > 1000} {
        set begin "[string range $result 0 499]\n...Finally...\n\n"
        append begin [string range $result end-500 end]
        set result $begin
    }
}

set hits ""
set sortedHits [lsort -stride 2 [array get ::ackermann::hits]]

foreach {def count} $sortedHits {
    append hits "$def = $count value=$::ackermann::cache($def)\n"
}

set len [expr {[llength $sortedHits]/2}]

set ackermannURLs [list ]
# calculate links to other Ackermann Implimentations:
proc createLink {m n c {r c}} {

}


ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Ackermann's Function</title>
<style>
body {
    font-family: 'Fira Code';
}
</style>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='m'>M (small int)</label>
  <input name='m' id='m'  value='$m'>
 </li>
 <li>
  <label for='n'>N (small int)</label>
  <input name='n' id='n' value='$n'>
 </li>
 <li>
  <label for='c'>ITERATIONS (small int)</label>
  <input name='c' id='c' value='$c'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?2'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
m = '$m'
n = '$n'
maxRecursions = '$::ackermann::maxRecursions'
COUNTER = '$::ackermann::COUNTER'
::ackermann::fn($m,$n) = $result
logs = 
[printLog log "\n"]
cache size = $len
----- CACHE -------
$hits
</pre>
</body>
</html>"
