set problem {
    #demonstrate usage of tcl interp for save computing
}

set solution {
    # Mostly interested in using interp to change the recursion limit
    # for massively recursive procedures.
    # The current built in limit is 1000.
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
    expr {$n + [poorlyDesignedRecursiveProc [expr {$n-1}] $max]}
}

set n 2
set defaultMax 1000
set max 5000

set form [ns_conn form]
set n [ns_set get $form n $n]
set m [ns_set get $form m $defaultMax]

if {$m > $max} {
    set m $max
}

set result [poorlyDesignedRecursiveProc $n $max]

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
  <label for='n'>Sum 1 up to:</label>
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
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
n = '$n'
maxRecursions = '$m'
result = '$result'

logs = 
[join $log "\n"]
</pre>
</body>
</html>"
