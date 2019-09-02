set problem {
    There's a staircase with N steps, and you can
    climb 1 or 2 steps at a time. Given N, write a
    function that returns the number of unique ways
    you can climb the staircase. The order of the
    steps matters.

For example, if N is 4, then there are 5 unique ways:

1, 1, 1, 1
2, 1, 1
1, 2, 1
1, 1, 2
2, 2
What if, instead of being able to climb 1 or 2 steps
at a time, you could climb any number from a set of
positive integers X? For example, if X = {1, 3, 5},
you could climb 1, 3, or 5 steps at a time. Generalize
your function to take in X.
}

set math_description {
    how many ways can you represent an integer as the
    sum of members of the input set (X) of smaller integers.

    note: you can use any combination of members of
}

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
            ns_log Notice "childlist = '$childlist' count = '$count'"
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

ns_return 200 text/html "
<html>
<head>
<title>Combinations of additive factors '\{$X\}' totaling '$target'</title>
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
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.txt'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
target = '$target'
X = '$X'
comboList = '[string map {\{ "\n\{"} $comboList]'
count = '$::combo::count'

Results:
[join $::combo::results \n]


Unique:
[join [showUnique $::combo::results] \n]
</pre>
</body>
</html>"