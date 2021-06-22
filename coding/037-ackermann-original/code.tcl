set problem {
    # Code up the original Ackermann function
}

set solution {
    # The function requires a recursive procedure
    # Since Tcl is now stackless, this should work ok in tcl.
    #include <stdio.h>

    # Original Algo, plus pseudo code

    # From https://sites.google.com/site/pointlesslargenumberstuff/home/2/ackermann

    φ(x,y,0) = x+y
    φ(x,y,z) = φ(x,φ(x,y-1,z),z-1)
    φ(x,0,z) = α(x,z-1) (α is the Greek letter alpha, see below)

             /0 if y = 0
    α(x,y) = |1 if y = 1
             \x otherwise

    # From WikiPedia: https://en.wikipedia.org/wiki/Ackermann_function    

    φ(m,n,0) = m+n
    φ(m,0,1) = 0
    φ(m,0,2) = 1
    φ(m,0,p) = m
    φ(m,n,p) = φ(m,φ(m,n-1,p),p-1)
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

proc α {m p} {
    expr {($p==0)?0:($p==1)?1:$m}
}

proc φ {m n p} {
    global COUNTER
    incr COUNTER
    global c 
    rec log "B=[format %0.7d $COUNTER] φ($m,$n,$p)"
    if {$COUNTER > $c} {
        rec log "max iterations $c reached m=$m, n=$n, p=$p, ans='not determined'"
        return 0
    }
    if {$n==0} {
        set ans [α $m [expr {$p-1}]]
    } elseif {$p==0} {
        set ans [expr {$m + $n}]
    } else {
        set ans [φ $m [φ $m [expr {$n-1}] $p] [expr {$p-1}]]
    }
    rec log "E=[format %0.7d $COUNTER] φ($m,$n,$p)=$ans"

    return $ans
}

set m 0
set n 0
set p 0
set c 50000
set COUNTER 0

set form [ns_conn form]
set m [ns_set get $form m $m]
set n [ns_set get $form n $n]
set p [ns_set get $form p $p]
set c [ns_set get $form c $c]

if {$c > 1000000} {
    set c 1000000
}

try {
    set result [φ $m $n $p]
} on error {e} {
    global errorInfo
    set result "error $e \n$errorInfo"
    if {[string length $result] > 1000} {
        set begin "[string range $result 0 499]\n...Finally...\n\n"
        append begin [string range $result end-500 end]
        set result $begin
    }
}

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Ackermann Function As Defined</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<h2 style='color:red'>NOTE: Reference Algo is incorrect! try 
<a href='./code-2.tcl?m=$m&n=$n&p=$p&c=$c'>code-2.tcl</a></h2>
<ul>
 <li>
  <label for='m'>M (x) (small int)</label>
  <input name='m' id='m'  value='$m'>
 </li>
 <li>
  <label for='n'>N (y)(small int)</label>
  <input name='n' id='n' value='$n'>
 </li>
 <li>
  <label for='p'>P (z)(small int)</label>
  <input name='p' id='p' value='$p'>
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
p = '$p'
c = '$c'
COUNTER = '$COUNTER'
φ($m,$n,$p) = $result
logs = 
[printLog log "\n"]
</pre>
</body>
</html>"
