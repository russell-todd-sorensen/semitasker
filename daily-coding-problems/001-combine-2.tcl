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
proc combos {target {X {1 2}}} {

    set X [lsort -increasing -integer -unique $X]
    set combo [list]
    foreach x $X {
        set result [expr $target - $x]
        if {$result == 0} {
            #lappend combo $result
            #return $combo
            lappend combo [concat $combo $result] ; # This trail ends
        } elseif {$result < [lindex $X 0]} {

        } else {
            #lappend combo [combos $result $X]
            lappend combo [concat $combo $result]
        }

    }
    return $combo
}

set comboList [combos $target $X]

set num [llength [concat $comboList]]

ns_return 200 text/html "
<html>
<head>
<title>Combinations of additive factors '\{$X\}' totalling '$target'</title>
</head>
<body>
<form>
<ul>
 <li>
  <label for='target'>Target</label>
  <input name='target' id='target' type='number' value='$target'>
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
<pre>
target = '$target'
X = '$X'
comboList = '$comboList'
count = '$num'
"