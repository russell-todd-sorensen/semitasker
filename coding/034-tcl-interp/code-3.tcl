set problem {
    #demonstrate usage of tcl interp for safe computing
}

set solution {
    # Mostly interested in using interp to change the recursion limit
    # for massively recursive procedures.
    # The current built in limit is 1000.

    # This example uses the fibonacci sequence, but dispite the
    # pathological nature of the algorithm, the recursive depth
    # never exceeds the number 'n' of the fibonacci to calculate.
    ↑
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

    global log 
    global recursions
    global running
    global maxIterations
    global iterations
    set logName log
    set $logName [list]
    set recursions 0
    set maxLevel 0
    set running 0

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

    proc fib {n tag} {
        global running 
        global recursions
        global logName
        global maxIterations
        incr recursions
        set instance $recursions
        if {$instance >= $maxIterations} {
            rec $logName "reached max iterations of fib(), refusing to continue"
            return 0
        }
        global maxLevel
        incr running 1
        set level [info level]
        if {$level >= $maxLevel} {
            set maxLevel $level
            rec $logName "instance=$instance, new maxLevel=$maxLevel" 
        }
        if {($recursions % 10000) == 0} {
            rec $logName "instance=$instance, recursions=$recursions, n=$n, tag='$tag', level=[info level]"
        }
        set val [expr {
            $n==0 
            ? 0 
            : $n==1 
            ? 1 
            : [fib [expr {$n-1}] "a$instance"] + [fib [expr {$n-2}] "b$instance"]
        }];
        incr running -1 
        rec $logName "instance='$instance', val='$val', tag='$tag', still running: $running"
        return $val
    }

}


set n 2
set defaultMax 1000
set max 2000
set maxIterations 1000000

set form [ns_conn form]
set n [ns_set get $form n $n]
set m [ns_set get $form m $defaultMax]
set m2 [ns_set get $form m2 $maxIterations]

if {$m > $max} {
    set m $max
}
if {$m2 > $maxIterations} {
    set m2 $maxIterations
}

# raise upper limit on recursive calls
try {
    interp recursionlimit $myInterp $m
    interp eval $myInterp set maxIterations $m2
    set result [$myInterp eval fib $n "start"]
    set logs [$myInterp eval printLog log]
    set recursions [$myInterp eval set recursions]
ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Recursive Fibonacci Calculation Showing Stack Depth</title>
<style>
#n,
#m,
#m2 {
    width: 75px;
}
#form1 li {
    height: 1.5em;
}
</style>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false' id='form1'>
<ul>
 <li>
  <label for='n'>Fib(n):</label>
  <input name='n' id='n' type='number' placeholder='Enter value of n'  value='$n'>
 </li>
 <li>
  <label for='m'>Max stack depth:</label>
  <input name='m' id='m' type='number' placeholder='Max depth' value='$m'>
 </li>
 <li>
  <label for='m2'>Max Iterations:</label>
  <input name='m2' id='m2' type='number' placeholder='Max calls to fib()' value='$m2'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?3'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
n = '$n'
maxRecursive depth (stack) = '$m'
maxIterations (calls to fib(x)) = '$m2'
[expr {($m2<$recursions)?"result='invalid'":"result = '$result'"}]
fib executed $recursions times
logs =
$logs
</pre>
</body>
</html>"
} on error {errorTrace optionList} {
    global errorInfo
    set errorText [ns_adp_parse -file [ns_url2file /services/return-code/500/internal-server-error.adp]]
    ns_return 500 text/html $errorText
}