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
    Im thinking we keep the greatest current value
    in a buffer. Every time we get a new greatest value
    we flush the buffer of
}

global log
set log [list]

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

proc maxOfEachSubArray {a k} {
    global log

    # we'll not peek at the length of a
    set l 0
    set i 0
    set j 1
    set maxInBuffer 0

    # temp assumption is all ints > 0
    for {set bi 0} {$bi < $k} {incr bi} {
        set B($bi) 0
    }

    rec log "- Buffer = [array get B]"

    foreach num $a {
        set A($l) $num
        set bufIndex [expr {$i%$k}]
        if {$num >= $maxInBuffer} {
            set B($bufIndex) $num
            set maxInBuffer $num
        } else {
            set B($bufIndex) $maxInBuffer
        }
        if {$i >= [expr {$k - 1}]} {
            rec log "Max in Buffer=$maxInBuffer"
        }
        rec log "A($l) = $num"
        printArray A
        printArray B
        incr i
        incr j
        incr l
    }

}

set a [list 1 2 3 4 5 6 7 8 9]
set k 3

set form [ns_conn form]
set a [ns_set get $form a $a]
set k [ns_set get $form k $k]

set result [maxOfEachSubArray $a $k]

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
  <input name='a' id='a'  value='$a'>
 </li>
 <li>
  <label for='k'>SubArray Length</label>
  <input name='k' id='k' value='$k'>
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
result = '$result'
log = [join $log \n]
</pre>
</body>
</html>"
