set problem {
    # Enter problem description, exactly started
Given an array of integers and a number k, where
1 <= k <= length of the array, compute the maximum
values of each subarray of length k.

For example, given array = [10, 5, 2, 7, 8, 7]
and k = 3, we should get: [10, 7, 8, 8], since:

10 = max(10, 5, 2)
7 = max(5, 2, 7)
8 = max(2, 7, 8)
8 = max(7, 8, 7)
Do this in O(n) time and O(k) space. You can modify
the input array in-place and you do not need to
store the results. You can simply print them out
as you compute them.

}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.

}

global log
set log [list]

global comparisons
set comparisons 0

proc rec {logName what} {
    upvar $logName log
    lappend log $what
}

proc printArray {arrayName} {
    global log

    upvar $arrayName Array
    set textArray "$arrayName= "
    foreach index [lsort -increasing -integer [array names Array]] {
        append textArray "$Array($index) "
    }
    rec log $textArray
}

proc printSubArray {arrayName from to} {
   global log

    upvar $arrayName Array
    set textArray "$arrayName ([expr $from],[expr $to])= "
    foreach index [lrange [lsort -increasing -integer [array names Array]] $from $to] {
        append textArray "$Array($index) "
    }
    rec log $textArray
}

proc maxOfEachSubArray {a k} {
    global log
    global comparisons
    # we'll not peek at the length of a
    set indexQExit 0
    set indexQEntr 0
    set indexOfMax 0
    set comparisons 0
    set maxInBuffer [expr -1 << (($::tcl_platform(wordSize)*8)+1)]

    set kStorage [list]

    rec log "\n--- Explanation ---"

    foreach num $a {
        set A($indexQEntr) $num
        incr comparisons
        if {$A($indexQEntr) >= $maxInBuffer} {
            set indexOfMax $indexQEntr
            set maxInBuffer $A($indexQEntr)
        } elseif {$indexOfMax < $indexQExit} {
            # We don't know where the max value is
            # we don't know how the new value compares
            # to the previously added values.
            rec log "Lost Max..."
            set indexOfMax $indexQEntr
            for {set i [expr $indexQEntr - 1]} {$i >= $indexQExit} {incr i -1} {
                incr comparisons
                if {$A($i) > $A($indexOfMax)} {
                    set indexOfMax $i
                    rec log "indexOfMax set to $i value=$A($i)"
                }
            }
            set maxInBuffer $A($indexOfMax)
            rec log "maxInBuffer set to $A($indexOfMax) at $indexOfMax"
        }

        if {$indexQEntr >= $k-1} {
            #incr comparisons
            #if {$A($indexQExit) >= $A($indexOfMax)} {
            #    rec log "Adjusted indexOfMax from $indexOfMax to $indexQExit"
            #    set indexOfMax $indexQExit
            #}
            rec log "Output($indexQEntr) = $A($indexOfMax)"
            lappend kStorage $A($indexOfMax)
            incr indexQExit
        }

        rec log "A($indexQEntr) = $num"
        printArray A
        printSubArray A $indexQExit-1 $indexQEntr
        rec log "---- end step $indexQEntr ----"
        incr indexQEntr
    }
    rec log "Final Result = $kStorage"

    return $kStorage
}

set a [list 10 5 2 7 8 7]
set k 3
set r 0
set s 10

set form [ns_conn form]
set a [ns_set get $form a $a]
set k [ns_set get $form k $k]
set r [ns_set get $form r $r]
set s [ns_set get $form s $s]


proc generateRandomArray {r s} {
    set a [list]
    if {$r} {
        # Generate random array values, length of r
        set range [expr round($r * $s)]
        for {set i 0} {$i < $r} {incr i} {
            lappend a [ns_rand $range]
        }
    }
    return $a
}

if {[string is integer -strict $r] && $r > 0}  {
    set a [generateRandomArray $r $s]
}

set result [maxOfEachSubArray $a $k]
ns_log Notice "a = $a"
set len [string length $a]

ns_return 200 text/html "
<html>
<head>
<title>Fill In Something Useful</title>
</head>
<body>
<form autocomplete='off'>
<ul>
 <li>
  <label for='a'>Input Integer Array</label>
  <input name='a' id='a' size='$len' value='$a'>
 </li>
 <li>
  <label for='k'>SubArray Length</label>
  <input name='k' id='k' value='$k'>
 </li>
 <li>
  <label for='r'>Random Elements #</label>
  <input name='r' id='r' value='$r'>
 </li>
 <li>
  <label for='s'>Space Multiplier:</label>
  <input name='s' id='s' value='$s'>
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
k = '$k'
r = '$r'
result = '$result'
comparisons = '$comparisons' len = '[llength $a]' ratio = [format %f3 [expr {1.0*$comparisons/[llength $a]}]] comparisons/element
log = [join $log \n]
</pre>
</body>
</html>"
