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

proc bool {args} {
    global log
    return false
    set args [string map {\\ \\\\ \[ \\[ \$ \\$} $args]
    set result [expr {*}$args]
    set result [string map {\\ \\\\ \[ \\[ \$ \\$} $result]
    rec log "args='$args' {*}\$args='{*}$args' result='$result'" 
    expr ("$result")?true:false
    rec log [info vars]
    expr ("$result")?true:false
}

set a {3 > 5}

set form [ns_conn form]
set a [ns_set get $form a $a]

try {
    set result [bool $a]
} on error {emsg opt} {
    set result "emsg: $emsg options: [dict get $opt]"
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
  <label for='a'>Expression:</label>
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
a = '$a'
result = '$result'
logs = [printLog log]
</pre>
</body>
</html>"
