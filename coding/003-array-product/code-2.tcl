set problem {

Given an array of integers, return a new array such that
each element at index i of the new array is the product
of all the numbers in the original array except the one
at i.

For example, if our input was [1, 2, 3, 4, 5], the expected
output would be [120, 60, 40, 30, 24]. If our input was
[3, 2, 1], the expected output would be [2, 3, 6].

Follow-up: what if you can't use division?
}

set answer {
    input = [a,b,c,d,e]
    0 = [1,b*c*d*e] [-,  1-4]
    1 = [a,c*d*e]   [0,  2-4]
    2 = [a*b,d*e]   [0-1,3-4]
    3 = [a*b*c,e]   [0-2,  4]
    4 = [a*b*c*d,1] [0-4,  -]

    Every output index can be expressed as the product two numbers.
    These two numbers are the product of elements to the left
    of the index and those to the right of the index. These two
    number can be built up in such a way that only three multiplications
    need to be done for each output index.
    Explain The Solution:

    

}

set form [ns_conn form]
set inList [ns_set iget $form in {1 2 3 4 5}]
g 
proc listProduct {inList} {
    set left  1
    set right 1
    set len [llength $inList]
    set leftIndex 0
    set rightIndex [expr $len -1]
    set outList [list]
    for {set i $leftIndex; set j $rightIndex} { ($i < $len) && ($j > -1)} {incr i; incr j -1} {
        set p($i,0) $left
        set left [expr {$left * [lindex $inList $i]}]
        set p($j,1) $right
        set right [expr {$right * [lindex $inList $j]} ]
    }
    for {set i 0} {$i < $len} {incr i} {
        lappend outList [expr $p($i,0)*$p($i,1)]
    }
    return $outList
}

set result [listProduct $inList]

ns_return 200 text/html "
<html>
<head>
<title>Product Array '$inList' Sans Index</title>
</head>
<body>
<form>
<ul>
 <li>
  <label for='in'>Input List</label>
  <input name='in' id='in'  value='$inList'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.txt'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
inList = '\[[join $inList ,]\]'
result = '\[[join $result ,]\]'
</pre>
</body>
</html>"
