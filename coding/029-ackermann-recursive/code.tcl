set problem {
    # Define Ackerman's Function using recursive procedure
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



proc ackermannFn {m n} {
    global COUNTER c
    incr COUNTER
    rec log "B=[format %0.7d $COUNTER] ack($m,$n)"
    if {$COUNTER > $c} {
        rec log "max iterations $c reached m=$m, n=$n ans='not determined'"
        return 0
    }
    if {$m == 0} {
        set ans [expr {$n + 1}]
    } elseif {$n == 0} {
        set ans [ackermannFn [expr {$m-1}] 1]
    } else {
        set ans [ackermannFn [expr {$m-1}] [ackermannFn $m [expr {$n-1}]] ]
    }
    rec log "E=[format %0.7d $COUNTER] ack($m,$n)=$ans"
    return $ans
}



set m 0
set n 0
set c 50000
set COUNTER 0

set form [ns_conn form]
set m [ns_set get $form m $m]
set n [ns_set get $form n $n]
set c [ns_set get $form c $c]

if {$c > 1000000} {
    set c 1000000
}

try {
    set result [ackermannFn $m $n]
} on error {e} {
    global errorInfo
    set result "error $e \n$errorInfo"
}

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Fill In Something Useful</title>
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
c = '$c'
COUNTER = '$COUNTER'
ackermannFn($m,$n) = $result
logs = 
[printLog log "\n"]
</pre>
</body>
</html>"
