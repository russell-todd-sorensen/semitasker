set problem {
    # Enter problem description, exactly started
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
    Generate random value and use this to decide
    whether or not to pick the next element from
    list.
}

global allRvalues L
set allRvalues [list]
if {[array exists L]} {
    array unset L
}

proc randomSelectFromFiniteStream {numberToSelect {start 1} {end 20000} {group 10}} {

    global allRvalues L

    for {set i $start;set j $start} {$j <= $numberToSelect+$start} {incr i;incr j} {
        set R($j) $i
        set L($j) "$i"
    }

    set foldValue [expr {$i % $group}]
    while {
        $i <= $end
    } {
        set rand [ns_rand [expr {$i+$start}]]
        set rvalue [expr { $rand + $start}] ;# chooses number between $start and $i+$start inclusive
        set chosen false
        ns_log Notice "rvalue = '$rvalue' rand='$rand'"
        if {($i % $group) == $foldValue} {
            lappend allRvalues "\n"
        }
        if {$rvalue <= $start+$numberToSelect} {
            ns_log Notice "   R($rvalue) was $R($rvalue) replaced with $i  R($rvalue) = '$R($rvalue)'"
            append L($rvalue) " => $i"
            set R($rvalue) $i
            incr numberSelected
            set chosen true
        }
        if {$chosen} {
            lappend allRvalues "<b>$rvalue</b>"
        } else {
            lappend allRvalues $rvalue
        }

        incr i
    }
    return [array get R]
}

set n 100
set s 1
set e 1000
set g 10

set form [ns_conn form]

set n [ns_set get $form n $n]
set s [ns_set get $form s $s]
set e [ns_set get $form e $e]
set g [ns_set get $form g $g]

set result [randomSelectFromFiniteStream $n $s $e $g]

set start $s
set end   $e
set group $g

if {[array exists R]} {
    array delete R
}
array set R $result
foreach name [lsort -integer -increasing [array names R]] {
    lappend lines "R($name) = $R($name) \[History $L($name)\]"
}

set N [array names R]
set values [list]
foreach name $N {
    lappend values $R($name)
}

set V [lsort -increasing -integer $values]
set div [expr (($e - $s)/$n)+1]

set VROWS [list ""]
set count 0
set row 1
foreach v $V {

    if {$v > (($end - $start)*$row/$div)} {
        lappend VROWS " count=($count)\n"
        incr row
        set count 0
    }
    incr count
    lappend VROWS $v
}
lappend VROWS " count=($count)\n"

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
n        = '$n'
start    = '$s'
end      = '$e'
group by = '$g'
result   = '$result'

histogram (div=$div)=
[join $VROWS]

allRvalues = '[join $allRvalues]'
values     =
[join $lines \n]

</pre>
</body>
</html>"
