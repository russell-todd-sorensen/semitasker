set problem {
    #demonstrate usage of tcl interp for save computing
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

    global log 
    global recursions 0
    set log [list]
    set logName log
    set maxLevel 0

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
        global recursions
        global logName
        incr recursions
        set instance $recursions
        global maxLevel
        set level [info level]
        if {$level >= $maxLevel} {
            set maxLevel $level
            rec $logName "instance=$instance, new maxLevel=$maxLevel" 
        }
        if {($recursions % 10000) == 0} {
            rec $logName "instance=$instance, recursions=$recursions, n=$n, tag='$tag', level=[info level]"
        }
        expr {
            $n==0 
            ? 0 
            : $n==1 
            ? 1 
            : [fib [expr {$n-1}] "a"] + [fib [expr {$n-2}] "b"]
        };
    }

}


set n 2
set defaultMax 1000
set max 35

set form [ns_conn form]
set n [ns_set get $form n $n]
set m [ns_set get $form m $defaultMax]

if {$m > $max} {
    set m $max
}

# raise upper limit on recursive calls
try {
    interp recursionlimit $myInterp $m

    set result [$myInterp eval fib $n "start"]
    set logs [$myInterp eval printLog log]
    set recursions [$myInterp eval set recursions]
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
  <label for='n'>Fibonacci:</label>
  <input name='n' id='n'  value='$n'>
 </li>
 <li>
  <label for='m'>Max recursion:</label>
  <input name='m' id='m' value='$m'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?5'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<p>Although the number of recursions increases exponentially, 
the stack depth at any time is close to the given 'n' value.
<pre>
n = '$n'
maxRecursions = '$m'
result = '$result'
recursion limit = [interp recursionlimit $myInterp]
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