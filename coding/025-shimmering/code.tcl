set problem {
    # Enter problem description, exactly started
    demonstrate shimmering of tcl variables on
    performance.
    Tcl internally stores variables in several formats.
    Shimmering is the name for code which causes this 
    internal representation to alternate between one form 
    and another. There is a substantial performance 
    penalty on this switching back and forth, which if
    done in a loop cannot be ignored. Isolated shimmering
    is not a problem, and shimmering has zero effect on
    the correctness of code results. 

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

proc runShimmerCode {n cid {codeArray code}} {
    upvar 1 ${codeArray}($cid) code
    global timing
    set timing [time $code 1]
}

global timing
global code

set timing 0;
set n 10
set cid 0

set code(0) {
    for {set i 1} {$i <= $n} {incr i} { 
        lappend res $i
        if {$i % ($n/10) == 0} {
            ns_log Notice "Done code(0) $i times"
        }
    }
}

set code(1) {
    set x ""
    for {set i 1} {$i <= $n} {incr i} {
        lappend x [string bytelength $x]
        if {$i % ($n/10) == 0} {
            ns_log Notice "Done code(1) $i times"
        }
    }
}

set code(2) {
    for {set i 1} {$i <= $n} {incr i} { 
        lappend x $i; 
        append x . 
        if {$i % ($n/10) == 0} {
            ns_log Notice "Done code(2) $i times"
        }
    }
}

set form [ns_conn form]
set n [ns_set get $form n $n]
set cid [ns_set get $form cid $cid]

if {$n > 10000} {
    set n 10000
}

if {![info exists code($cid)]} {
    set cid 0
}

set result [runShimmerCode $n $cid code]

set codeHtml [list]
for {set i 0} {$i < [array size code]} {incr i} {
    lappend codeHtml "<li><code>$i : $code($i)</code></li>"
}

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Demonstrate Performance Effect of Shimmering.</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='n'>Loop Repetition </label>
  <input name='n' id='n' type='number' max='10000' min='1' value='$n'>
 </li>
 <li>
  <label for='cid'>CodeId to Iterate</label>
  <input name='cid' id='cid' value='$cid'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='https://wiki.tcl-lang.org/page/shimmering'>Shimmering Explained</a><br>
<a href='explained.txt'>Solution Explained</a>
<ul>
[join $codeHtml "\n"]
</ul>
<pre>
n = '$n'
cid = '$cid'
Code = '$code($cid)'
timing = '$timing'
result = '$result'
</pre>
</body>
</html>"
