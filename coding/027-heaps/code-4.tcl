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

proc fix {i} {
    expr $i - 1
}

proc heapAt {heapName i} {
    upvar $heapName heap
    rec log "heapAt: i='$i' \[fix $i\] ='[fix $i]' val='[lindex $heap [fix $i]]'"
    lindex $heap [fix $i]
}

proc permuteHeapMain {heap newElement {popSmallest false}} {
    global poppedValues
    set n [llength $heap]
    if {$popSmallest} {
        exchange heap 1 $n
        lappend poppedValues [lindex $heap end]
        set heap [lrange $heap 0 end-1]
        set newElement [lindex $heap 0]
    } else {
        set heap [concat $newElement $heap]
    }
    set j 1
    set n [llength $heap]
    rec log "----- PermuteHeapMain: starting with heap=$heap newElement=$newElement ----- n = $n j = $j"
    while (true) {
        set k [expr {$j * 2}]
        rec log "while k = $k j = $j"
        if {$k > $n} {
            rec log "break at permuteHM k > n ($k > $n)"
            break
        }
        set kp1 [expr {$k + 1}]
        rec log "heap = $heap"
        set xk [heapAt heap $k]
        set xk1 [heapAt heap $kp1]
        ns_log Notice "kp1=$kp1, xk=$xk, xk1=$xk1"
        if {$k < $n && ($xk1 < $xk)} {
            incr k
            set xk [heapAt heap $k]
            set xk1 [heapAt heap [expr {$k + 1}]]
            rec log "incr k = $k"
        }
        if {$newElement <= $xk} { ;# changed from <= $xk1
            rec log "break at $newElement <= xk $newElement <= $xk"
            break
        }

        exchange heap $j $k 
        set j $k
    }
    return $heap
}

proc permuteHeapMain2 {heap newElement {popSmallest false}} {
    global poppedValues
    set n [llength $heap]
    if {$popSmallest} {
        exchange heap 1 $n
        lappend poppedValues [lindex $heap end]
        set heap [lrange $heap 0 end-1]
        set newElement [lindex $heap 0]
    } else {
        set heap [concat $newElement $heap]
    }
    set j 1
    set n [llength $heap]
    rec log "----- PermuteHeapMain: starting with heap=$heap newElement=$newElement ----- n = $n j = $j"
    while {[set k [expr {$j * 2}]] < $n} {
        set kp1 [expr {$k + 1}]
        if {($k < $n) && [heapAt heap $kp1] < [heapAt heap $k]} {
            incr k
            
        }
        
    }
    while (true) {
        set k [expr {$j * 2}]
        rec log "while k = $k j = $j"
        if {$k > $n} {
            rec log "break at permuteHM k > n ($k > $n)"
            break
        }
        set kp1 [expr {$k + 1}]
        rec log "heap = $heap"
        set xk [heapAt heap $k]
        set xk1 [heapAt heap $kp1]
        ns_log Notice "kp1=$kp1, xk=$xk, xk1=$xk1"
        if {$k < $n && ($xk1 < $xk)} {
            incr k
            set xk [heapAt heap $k]
            set xk1 [heapAt heap [expr {$k + 1}]]
            rec log "incr k = $k"
        }
        if {$newElement <= $xk} { ;# changed from <= $xk1
            rec log "break at $newElement <= xk $newElement <= $xk"
            break
        }

        exchange heap $j $k 
        set j $k
    }
    return $heap
}

proc exchange {listName j k} {
    upvar $listName heap
    rec log "exchange heap = $heap j=[fix $j] k=[fix $k]"
    set y  [lindex $heap [fix $j]]
    set xk [lindex $heap [fix $k]]
    lset heap [fix $k] $y 
    lset heap [fix $j] $xk
    rec log "exchange heap = $heap"
}

proc verifyHeap {heapName} {
    upvar $heapName heap 
    set len [llength $heap]
    rec log "--------- VerifyHeap = $heap ------------"
    if {$len < 2}  {
        return true
    }
    set max [expr {($len)/2}]
    for {set i 1} {$i <= $max} {incr i} {
        rec log "verifyHeap max=$max"
        set xn  [heapAt heap $i]
        set x2n [heapAt heap [expr {$i * 2}]]

        if {$xn > $x2n} {
            rec log "failure at i=$i xn = $xn x2n=$x2n"
            return false
        } else {
            rec log "i = $i, (x($i)==$xn)  <= $x2n"
        }

        set x2np1 [heapAt heap [expr {$i * 2 + 1}]]

        if {($i * 2) >= $len} {
            rec log "i*2 = $i * 2 > $len"
            break
        }
        if {$xn > $x2np1} {
            rec log "failure at i=$i xn = $xn x2np1=$x2np1 heap = $heap"
            return false
        } else {
            rec log "i = $i, (x($i)==$xn)  <= $x2n and $xn <= $x2np1"
        }
    }
    return true
}

set h [list] 
set y [list]
set pop 0
set random 0

global poppedValues
set poppedValues [list]

set form   [ns_conn form]
set h      [ns_set get $form h $h]
set y      [ns_set get $form y $y]
set pop    [ns_set get $form p $pop]
set random [ns_set get $form r $random]

set previousHeap $h

if {$random > 0} {
    for {set i 1} {$i <= $random} {incr i} {
        set h [permuteHeapMain $h [expr {int([ns_rand] * $random * 20)}]]
    }
} elseif {[llength $y] > 0} {
    for {set i 0} {$i < [llength $y]} {incr i} {
        set h [permuteHeapMain $h [lindex $y $i]]
    }
}

if {$pop > 0} {
    if {$pop > [llength $h]} {
        set pop [llength $h]
    }
    set poppedValues [list]
    rec log "Popping $pop values"
    for {set i 0} {$i < $pop} {incr i} {
        set h [permuteHeapMain $h dummy true]
    }
}

set verified [verifyHeap h]

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
  <label for='h'>Initial/Current Heap</label>
  <input name='h' id='h'  value='$h'>
 </li>
 <li>
  <label for='y'>New Y (heap item)</label>
  <input name='y' id='y' value='$y'>
 </li>
 <li>
  <label for='r'>Random Value Count</label>
  <input name='r' id='r' value='$random'>
 </li>
 <li>
  <label for='p'>Pop Count:</label>
  <input type='number' name='p' id='p' value='$pop' min='0'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?4'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
previousHeap = '$previousHeap'
h = '$h'
y = '$y'
verified = '$verified'
popped values = '$poppedValues'
--------------
[printLog log]
</pre>
<div id='djb-credits'>
(From  <a href='./Enumerating Solutions.pdf'>Enumerating Solutions</a>)
 <h2>DANIEL J. BERNSTEIN</h2>
The use of heaps to enumerate sums in sorted order actually appeared much
earlier in another context, namely William S. Brown’s algorithm for multiplication
of sparse power series.
</div>

<div id='djb-credits'>

                   <h2> 2. Heaps (The Algorithm)</h2>
A heap is a sequence x<sub>1</sub>, x<sub>2</sub>,...,x<sub>n</sub> satisfying x<sub>k/2</sub> ≤ x<sub>k</sub> for 2 ≤ k ≤ n: i.e.,
x<sub>1</sub> ≤ x<sub>2</sub>, x<sub>1</sub> ≤ x<sub>3</sub>, x<sub>2</sub> ≤ x<sub>4</sub>,
 x<sub>2</sub> ≤ x<sub>5</sub>, x<sub>3</sub> ≤ x<sub>6</sub>, x<sub>3</sub> ≤ x<sub>7</sub>, etc.
The smallest element of a heap x<sub>1</sub>, x<sub>2</sub>,...,x<sub>n</sub> is x<sub>1</sub>. Given y, one can permute
y, x<sub>2</sub>,...,x<sub>n</sub> into a new heap by the following algorithm. First set j ← 1. Then
perform the following steps repeatedly: set k ← 2j; stop if k&gt;n; set k ← k + 1 if
k&lt;n and x<sub>k+1</sub> &lt; x<sub>k</sub>; stop if y ≤ x<sub>k</sub>; exchange y, 
which is now in the jth position,
with x<sub>k</sub>; set j ← k. The total number of operations here is O(log n).
In particular, using O(log n) operations, one can permute x<sub>n</sub>, 
x<sub>2</sub>,...,x<sub>n−1</sub> into a
new heap. By a similar algorithm, also using O(log n) operations, one can permute
x<sub>1</sub>, x<sub>2</sub>,...,x<sub>n</sub>, y into a new heap
</div>
</body>
</html>"
