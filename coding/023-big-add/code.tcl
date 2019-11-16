set problem {
    # Enter problem description, exactly started
    print all integer solutions to a^3 + b^3 = c^3 + d^3
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
    assume solution only if a and b are not equal
    solutions of the form aa^3 + b^3 = b^3 + a^3
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

global resHash
global cubes
global loopCount
global createCount
global cubesCreate

proc findMatch {n max} {
    global resHash
    global cubes
    global loopCount 
    global createCount
    global cubesCreate
    set loopCount 0;
    set createCount 0
    set cubesCreate 0
    set result [list]
    set len -2
    set resHash(0,0) [list 0 {0 0 0 0}]
    for {set i 1} {$i <= $n && ($len <= $max)} {incr i} {
        for {set j 1} {$j <= $n} {incr j} {
            incr loopCount
            #if {$i == $j} {
                #continue
            #}
            if {[info exists resHash($j,$i)]} {
                continue
            }
            if {![info exists cubes($j)]} {
                set cubes($j) [expr {$j*$j*$j}]
                incr cubesCreate
            }
            if {![info exists cubes($i)]} {
                set cubes($i) [expr {$i*$i*$i}]
                incr cubesCreate
            }
            lappend result [list $i $j]
            lappend result [list $j $i]
            set resHash($i,$j) [list [expr {$cubes($i) + $cubes($j)}] [list $i $j $j $i]]
            incr createCount
            incr len 1
        }
    }
    return $result
}

set n 4
set max [expr {$n * $n}]

set form [ns_conn form]
set n [ns_set get $form n $n]
set max [ns_set get $form max $max]

set result [findMatch $n $max]

# Now create table to show every combo has a twin
set len 0
set table "<table cellpadding='2' cellspacing='0' border='1'>
 <tr><th>&nbsp;</th>"
for {set y 1} {$y <= $n} {incr y} {
    append table "<th>$y : [expr {$y*$y*$y}]</th>"
}
append table "\n </tr>"
for {set x 1} {$x <= $n} {incr x} {
    append table "\n<tr><th>$x : [expr {$x*$x*$x}]</th>  "
    for {set y 1} {$y <= $n} {incr y; incr len} {
        if {$x <= $y} {
            if {![info exists resHash($x,$y)]} {
                append table "<td>&nbsp;</td>"
                continue
            }
            set data $resHash($x,$y)
        } else {
            if {![info exists resHash($y,$x)]} {
                append table "<td>&nbsp;</td>"
                continue
            }
            set data $resHash($y,$x) 
        }
        append table "<td class='g'>[lindex $data 0]</td>"
    }
    append table " </tr>"
}
append table "\n</table>"

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>All Solutions to a*a*a + b*b*b = c*c*c + d*d*d</title>
<style>
td.g {
    background-color: green;
}
</style>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='n'>N</label>
  <input name='n' id='n' value='$n'>
 </li>
 <li>
  <label for='max'>Max Solutions</label>
  <input name='max' id='max' value='$max'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
$table
<pre>
n = '$n'
max = '$max'
loops = '$loopCount'
createCount = '$createCount'
cubesCreate = '$cubesCreate'
matches = '[llength $result]'
result = [join $result "\n"]
resHash = '[join [array get resHash] \n]'
</pre>
</body>
</html>"
