set problem {
  Compare N of various functions
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
}

global log
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

proc square {N} {
    expr {$N * $N}
}
proc sqrt {N {end end}} {
    string range [expr sqrt($N)] 0 $end
}

proc nLogN {N} {
    expr {$N * log($N)}
} 

proc logN {N} {
    expr {log($N)}
}

proc timesN {N {start 1}} {
    expr {$start * $N}
}

proc twoPowLogN {N {end end}} {
    string range [expr pow(2, log($N))] 0 $end
}

proc fib {N} {
    switch -exact -- $N {
        0 {
            return 0
        }
        1 - 2 {
            return 1
        }
        3 {
            return 2
        }
        default {
            return [expr [fib [expr {$N -1}]] + [fib [expr {$N - 2}]]]
        }
    }
}

proc fib2 {N} {
    switch -exact -- $N {
        0 {
            return 0
        }
        1 - 2 {
            return 1
        }
        3 {
            return 2
        }
        default {
            set fibMinus2 [fib2 [incr N -2]]
            return [expr {$fibMinus2 + $N + 1}]
        }
    }
}

proc factorial {N} {
    if {$N < 0} {
        return -code error "Negative Number $N"
    }
    switch -exact -- $N {
        0 {
            return -code return 0
        }
        1 {
            return 1
        }
        2 {
            return 2
        }
        default {
            return [expr $N * [factorial [expr $N - 1]]]
        }
    }
}

proc twoPowN {N} {
    expr {entier(pow(2,$N))}
}

set n 5
set b 2

set form [ns_conn form]
set n [ns_set get $form n $n]
set b [ns_set get $form b $b]

proc calculate {N base} {
    set html "<table id='t1' cellspacing='0' cellpadding='2' border='1'>
 <tr>
  <th>N</th>
  <th>sqrt N</th>
  <th>log<sub>e</sub> N</th>
  <th>N*log<sub>e</sub> N</th>
  <th>2<sup>log<sub>e</sub>N</sup></th>
  <th>2<sup>N</sup>
  <th>N<sup>2</sup></th>
  <th>fib N</th>
  <th>fib2 N</th>
  <th>N!</th>
  <th>N*N!</th>
 </tr>"

    for {set i 1} {$i <= $N} {incr i} {
        set sq [sqrt $i 5]
        set ln [expr int(ceil([logN $i]))]
        set nln [expr int(ceil([nLogN $i]))]
        set 2pln [expr int(ceil([twoPowLogN $i 7]))]
        set tpn [twoPowN $i]
        set nsq [square $i]
        set fib [fib $i]
        set fib2 [fib2 $i]
        set nfac [factorial $i]

        append html "
 <tr>
  <td>$i</td>
  <td class='real'>$sq</td>
  <td>$ln</td>
  <td>$nln</td>
  <td>${2pln}</td>
  <td>${tpn}</td>
  <td>$nsq</td>
  <td>$fib</td>
  <td>$fib2</td>
  <td>$nfac</td>
  <td>[expr $nfac * $i]</td>
 </tr>"
    }
    append html "\n</table>"
    return $html
}

set result [calculate $n $b]

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Calculate and Compare Size and Time Complexity of Numbers for Given N</title>
</head>
<style>
#t1 td {
    text-align: right;
}

#t1 .real {
    text-align: left;
}
</style>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='n'>N</label>
  <input name='n' id='n'  value='$n'>
 </li>
 <li>
  <label for='b'>Base</label>
  <input name='b' id='b' value='$b'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
N = '$n'
base = '$b'
</pre>
$result
</body>
</html>"
