set problem {
    # Enter problem description, exactly started
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
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

proc permuteHeap {heap newElement} {
    lsort [lappend heap $newElement]
}


proc permuteHeapMain {heap newElement} {
    set j 1
    set heap [concat $newElement $heap]
    set n [llength $heap]

    while {[set k [expr {2* $j}]] <= $n} {
        set kp1 [expr {$k + 1}]
        set valueAtK [lindex $heap [fix $k]]
        log Notice "permuteHeapMain k=$k kp1 = $kp1 valueAtK=$valueAtK n=$n"
        while {$k < $n && ([lindex $heap [fix $kp1]] < $valueAtK)} {
            incr k
            ns_log Notice "permuteHeap k = $k"
            if {$newElement <= $valueAtK} {
                ns_log Notice "pHeap $newElement <= $valueAtK (k = $k)"
                break
            }
        }
        exchange heap $j $k
        set j $k
    }
    return $heap
}

proc fix {i} {
    expr $i - 1
}

proc heapAt {heapName i} {
    upvar $heapName heap 
    lindex $heap [fix $i]
}

proc permuteHeapMain {heap newElement {popSmallest false}} {
    global poppedValue
    if {$popSmallest} {
        set poppedValue [lindex $heap 0]
        set heap [lrange $heap 1 end]
        set newElement [lindex $heap 0]
    } else {
        set heap [concat $newElement $heap]
    }
    set j 1
    set n [llength $heap]
    ns_log Notice "starting with heap=$heap newElement=$newElement"
    while (true) {
        set k [expr {$j * 2}]
        log Notice "while k = $k"
        if {$k > $n} {
            ns_log Notice "break at permuteHM k > n ($k > $n)"
            break
        }
        set kp1 [expr {$k + 1}]
        set xk [heapAt heap $k]
        set xk1 [heapAt heap $kp1]
        ns_log Notice "kp1=$kp1, xk=$xk, xk1=$xk1"
        if {$k < $n && ($xk1 < $xk)} {
            incr k
            ns_log Notice "incr k = $k"
        }
        if {$newElement <= $xk} { ;# changed from <= $xk1
            ns_log Notice "break at $newElement <= xk1 $newElement <= $xk1"
            break
        }

        exchange heap $j $k 
        set j $k
    }
    return $heap
}

proc exchange {listName j k} {
    upvar $listName heap
    set y  [lindex $heap [fix $j]]
    set xk [lindex $heap [fix $k]]
    lset heap [fix $k] $y 
    lset heap [fix $j] $xk
    ns_log Notice "exchange heap = $heap"
}

proc verifyHeap {heapName} {
    upvar $heapName heap 
    set len [llength $heap]
    if {$len < 2}  {
        return true
    }
    set max [expr {($len+1)/2}]
    for {set i 1} {$i <= $max} {incr i} {
        set xn [heapAt heap $i]
        set x2n [heapAt heap [expr {$i * 2}]]
        if {$xn > $x2n} {
            ns_log Notice "failure at i=$i xn = $xn x2n=$x2n"
            return false
        } 
        if {$i*2 >= $max} {
            rec log "i = $i, (x($i)==$xn)  <= $x2n"
            break
        }
        set x2np1 [heapAt heap [expr {$i * 2 + 1}]]
        if {$xn > $x2np1} {
            ns_log Notice "failure at i=$i xn = $xn x2np1=$x2np1"
            return false
        }
        rec log "i = $i, (x($i)==$xn)  <= $x2n and $xn <= $x2np1"
    }
    return true
}

set h [list 1 2 3 5 6 7] 
set y 4
set pop 0
global poppedValue
set poppedValue "none"

set form [ns_conn form]
set h [ns_set get $form h $h]
set y [ns_set get $form y $y]
set pop [ns_set get $form p $pop]

set previousHeap $h

set h [permuteHeapMain $h $y $pop] 
set verified [verifyHeap h]

if {$pop} {
    set checked " checked"
} else {
    set checked ""
}

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Heaps, Permuting Heaps</title>
<style>
#djb-credits {
    width: 800px;
}
</style>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='h'>Heap</label>
  <input name='h' id='h'  value='$h'>
 </li>
 <li>
  <label for='y'>New Y</label>
  <input name='y' id='y' value='$y'>
 </li>
 <li>
  <label for='p'>Pop Smallest</label>
  <input type='checkbox' name='p' id='p' value='1'$checked>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
previousHeap = '$previousHeap'
h = '$h'
y = '$y'
verified = '$verified'
popped value = '$poppedValue'
--------------
[printLog log]
</pre>
<div id='djb-credits'>
(From  <a href='./Enumerating Solutions.pdf'>Enumerating Solutions</a>)
 DANIEL J. BERNSTEIN
The use of heaps to enumerate sums in sorted order actually appeared much
earlier in another context, namely William S. Brown’s algorithm for multiplication
of sparse power series.




                    2. Heaps (The Algorithm)
A heap is a sequence x1, x2,...,xn satisfying xbk/2c ≤ xk for 2 ≤ k ≤ n: i.e.,
x1 ≤ x2, x1 ≤ x3, x2 ≤ x4, x2 ≤ x5, x3 ≤ x6, x3 ≤ x7, etc.
The smallest element of a heap x1, x2,...,xn is x1. Given y, one can permute
y, x2,...,xn into a new heap by the following algorithm. First set j ← 1. Then
perform the following steps repeatedly: set k ← 2j; stop if k>n; set k ← k + 1 if
k<n and xk+1 < xk; stop if y ≤ xk; exchange y, which is now in the jth position,
with xk; set j ← k. The total number of operations here is O(log n).
In particular, using O(log n) operations, one can permute xn, x2,...,xn−1 into a
new heap. By a similar algorithm, also using O(log n) operations, one can permute
x1, x2,...,xn, y into a new heap
</div>
</body>
</html>"
