
set form [ns_conn form]
set target [ns_set iget $form t 4]
set X      [ns_set iget $form x {1 2}]

namespace eval ::combo {
    variable count 0
    variable results [list]
}

proc ::combo::combos {target {X {1 2}} {parent ""}} {
    variable count
    variable results
    set X [lsort -increasing -integer -unique $X]
    set sublist [list $target]
    set childlist [list]
    foreach step $X {
        set result [expr $target - $step]
        if {$result == 0} {
            lappend childlist <$step>=<$parent$step>
            lappend results <$parent$step>
            incr count
            #ns_log Notice "childlist = '$childlist' count = '$count'"
        } elseif {$result < 0} {
            lappend childlist "-"
        } else {
            lappend childlist <<$step>>[combos $result $X $parent$step,]
        }
    }
    lappend sublist $childlist
}

proc showUnique {inList {trim <>} {sep ,}} {
    set outList [list]
    foreach combo $inList {
        lappend outList [lsort -integer -increasing [split [string trim $combo $trim] $sep]]
    }
    lsort -unique $outList
}

set comboList [::combo::combos $target $X]

set unique [showUnique $::combo::results]

set uniqueCount [llength $unique]

ns_return 200 text/html "
<html>
<head>
<title>Combinations of additive factors '\{$X\}' totaling '$target'</title>
<script src='partition.js'></script>
</head>
<body>
<form>
<ul>
 <li>
  <label for='t'>Target</label>
  <input name='t' id='t' type='number' value='$target'>
 </li>
 <li>
  <label for='x'>Factors</label>
  <input name='x' id='x' type='text' value='$X'>
 </li>
 <li>
  <label for='p'>Partition?</label>
  <input type='checkbox' name='p' id='p' value='1' onChange='togglePartition(\"p\",\"t\",\"x\")'>
</li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='001-combine-4.tcl.txt'>Source Code</a><br>
<a href='001-combine-4-explained.txt'>Solution Explained</a>
<pre>
target = '$target'
X = '$X'
comboList = '[string map {\{ "\n\{"} $comboList]'


Results: (count = '$::combo::count')
[join $::combo::results \n]


Partition: p($target) = '$uniqueCount'
[join $unique \n]
</pre>
</body>
</html>"