set problem {
    # Define Ackerman's Function using recursive procedure
    # Try to use memory to avoid recalculating already known
    # results
}

set solution {
    # The function requires a recursive procedure
    # Since Tcl is now stackless, this should work ok in tcl.
    #include <stdio.h>

    # The C solution is below

    int ack(m,n)
    int m,n;
    {
        int ans;
        if (m == 0) ans = n+1;
        else if (n == 0) ans = ack(m-1,1);
        else ans = ack(m-1, ack(m,n-1));
        return (ans);
    }

    int main (argc, argv)
    int argc; char ** argv;

    { int i,j;
        for (i=0; i<6; i++)
            for (j=0;j<6; j++)
                printf ("ackerman (%d,%d) is: %d\n",i,j, ack(i,j));
    }

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
        set cache($m,$n) [expr {$n + 1}]
        incr hits($m,$n)
        append cacheHits "+"

    } elseif {$n == 0} {
        set mt [expr {$m-1}]
        if {[info exists cache($mt,1)]} {
            incr hits($mt,1)
            rec log "cacheHits $mt,1 = $hits($mt,1)"
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



# resort as integers m and n


set keyList [list]

foreach key [array names ::ackermann::cache] {
    set entry [split $key ","]
    lappend keyList {*}$entry
}

set sortedKeys [lsort -stride 2 -index 0 -integer [lsort -stride 2 -integer -index 1 $keyList]]

set sortedHits [lsort -stride 2 [array get ::ackermann::hits]]

foreach {def count} $sortedHits {
    append hits "$def = $count value=$::ackermann::cache($def)\n"
}

foreach {M N} $sortedKeys {
    if {![info exists ::ackermann::cache($M,$N)]} {
        set value "STRANGE: ::ackermann::cache($M,$N) not found in cache"
    } else {
        set value $::ackermann::cache($M,$N)
    }
    if {![info exists ::ackermann::hits($M,$N)]} {
        set hitsValue "WEIRD ::ackermann::hits($M,$N) not found in cache"
    } else {
        set hitsValue $::ackermann::hits($M,$N)
    }
    append cachedResults "ach([format %0.3d $M],[format %0.5d $N]) (hits=$hitsValue) = [format %10s $value]\n"
}

set len [expr {[llength $sortedHits]/2}]

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Ackermann Function with cache for m=0 and n=0, all calc results</title>
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
<a href='source.tcl'>Source Code</a><br>
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

----- FORMATTED Cache----
$cachedResults
</pre>
</body>
</html>"
