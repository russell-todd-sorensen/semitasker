set problem {
    # Enter problem description, exactly started
    How to Pick a Random Element from an Infinite Stream
    Let’s work through the problem of uniformly picking a 
    random element from a gigantic stream. This is a common 
    interview question at companies like Google and Facebook.
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
    Generate random value and use this to decide
    whether or not to pick the next element from
    list.
}

proc randomSelectFromInfiniteStream {probability numberToSelect {start 0} {end 20000}} {
    set i $start
    set numberSelected 0
    set result [list]
    while {($numberSelected < $numberToSelect)
        && ($i <= $end)
    } {
        set rvalue [ns_rand]
        if {$rvalue <= $probability} {
            lappend result $i
            incr numberSelected
        }
        incr i
    }
    return $result
}

set n 100
set p 0.1
set s 0
set e 20000
set g 10

set form [ns_conn form]
set p [ns_set get $form p $p]
set n [ns_set get $form n $n]
set s [ns_set get $form s $s]
set e [ns_set get $form e $e]
set g [ns_set get $form g $g]

set result [randomSelectFromInfiniteStream $p $n $s $e]

set start $s
set end   $e
set group $g

for {set i $start} {$i <= $end } {incr i $group} {
    set newLine [lrange $result $i [expr {$i+$group-1}]]
    set newLineLength [llength $newLine]
    if {
        $newLineLength == 0
    } {
        continue
    } elseif {
        $newLineLength != $group
    } {
        set group [llength $newLineLength]
        if {$group == 0} {
            break
        }
    }
    set range [expr {abs([lindex $newLine end] - [lindex $newLine 0])}]
    set pct [format %6.4f [expr {100.0*$group/$range}]]%
    lappend lines [concat $newLine ==> $range ==> $pct]
}

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Randomly Select elements from Infinite List</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='p'>Probability</label>
  <input name='p' id='p'  value='$p'>
 </li>
 <li>
  <label for='n'>Number to Select</label>
  <input name='n' id='n' value='$n'>
 </li>
 <li>
  <label for='s'>Start Index</label>
  <input name='s' id='s' value='$s'>
 </li>
 <li>
  <label for='e'>End Index</label>
  <input name='e' id='e' value='$e'>
 </li>
 <li>
  <label for='g'>Group By</label>
  <input name='g' id='g' value='$g'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
p        = '$p'
n        = '$n'
start    = '$s'
end      = '$e'
group by = '$g'
result   = '$result'

lines =
[join $lines \n]
</pre>
</body>
</html>"
