set problem {
    # Enter problem description, exactly started
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

proc illuminatingProcName {args} {
    return "todo"
}

set a todo
set b todo

set form [ns_conn form]
set a [ns_set get $form a $a]
set b [ns_set get $form b $b]

set printVars [list a b one r s twoPi oneSeventh twoSevenths fourSevenths]

set one 1
set r 0
set s 0

set twoPi [expr {2*3.14159265358979323846264338}]
set oneSeventh [expr {$twoPi/7}]
set twoSevenths [expr {$oneSeventh*2}]
set fourSevenths [expr {$twoSevenths*2}]

proc printResults {vars} {
    set results [list]
    foreach var $vars {
        upvar $var $var
        lappend results "$var='[set $var]'"
    }
    return $results
}

set result [printResults $printVars]

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
  <label for='b'>Input List</label>
  <input name='b' id='b'  value='$b'>
 </li>
 <li>
  <label for='a'>Target (k)</label>
  <input name='a' id='a' value='$a'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
[join $result "\n"]
</pre>
</body>
</html>"
