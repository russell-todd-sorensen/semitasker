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

proc combos {target {X {1 2}}} {
    # first sort X and remove duplicates
    if {$target <= 0} {
        return 0
    }
    set X [lsort -increasing -integer -unique $X]
    set combo [list]
    foreach x $X {
        set result [expr $target - $x]
        if {$result == 0} {
            #lappend combo $result
            #return $combo
            return [concat $combo $result]
        } elseif {$result < [lindex $X 0]} {
            return [list]
        } else {
            #lappend combo [combos $result $X]
            set combo [concat $combo $result]
        }

    }
    return $combo
}

set comboList [combos 6 {6}]

set num [llength [concat $comboList]]

ns_return 200 text/plain "comboList = $comboList
count = $num
"