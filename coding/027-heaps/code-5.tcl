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

namespace eval ::heap {
    variable heap
    variable initialized 0
    variable trace 0
}

proc ::heap::init {} {
    variable heap
    variable initialized
    variable size

    if {!$initialized} {
        set heap [list]
        set size 0
    }

    set initialized 1
}

proc ::heap::new {typeArgs typeBody {ltBody {
    variable heap
    expr {[lindex $heap $a] < [lindex $heap $b]}
}}  
} {
    variable heap
    variable size
    variable initialized
    variable entryTypeBody
    variable entryTypeArgs
    variable ltProcBody

    if {$initialized} {
        return -code error "Heap Already Exists... maybe use ::heap::renew"
    } else {
        init
    }

    proc ::heap::newEntry $typeArgs $typeBody
    proc ::heap::lt {a b} $ltBody

    ::heap::newEntry
}
proc ::heap::add0 {entry} {
    variable heap
    lset heap 0 $entry
}

proc ::heap::permute {jPre nPre} {
    variable heap
    variable size
    variable trace
    if {$trace} {
        global j n q p 
    }
    set j $jPre 
    set n $nPre
    set q $j 
    set p [expr {$q<<1}]

    while {$p < $n} {
        set pp1 [expr {$p + 1}]
        if {[lt $pp1 $p]} {
            incr p
        }
        lset heap $q [lindex $heap $p]
        set q $p 
        set p [expr {$q<<1}]
    }
    if {$p == $n} {
        lset heap $q [lindex $heap $p]
        set q $p 
    }
    set p [expr {$q>>1}]
    while {($q > $j) && ([lt 0 $p])} {
        lset heap $q [lindex $heap $p]
        set q $p
        set p [expr {$q>>1}]
    }
    lset heap $q [lindex $heap 0];
}

proc ::heap::peek {pos} {
    variable size
    variable heap
    if {$pos > 0 && $pos <= $size} {
        return [lindex $heap $pos]
    } else {
        return ""
    }
}

proc ::heap::push {entry} {
    variable heap
    variable size
    set heap [list $entry $entry {*}[lrange $heap 1 end]]
    incr size
}

proc ::heap::pop {} {
    variable size
    variable heap

    if {$size == 0} {
        return ""
    }
    set popped [lindex $heap 1]
    lset heap 0 [lindex $heap $size]
    incr size -1
    set heap [lrange $heap 0 $size]
    if {$size > 1} {
        ns_log Notice "pop size=$size popped = $popped"
        permute 1 $size
    }
    return $popped
}

proc ::heap::initHeap {} {
    variable size
    
    set n $size
    set j [expr {$n/2 + 1}]

    while {$j > 1} {
        incr j -1
        add0 [peek $j]
        permute $j $n
    }
}

set h 0
set random 0
set pop 0
set verified 0
set poppedValues [list]
set previousHeap [list]
set trace false


set form   [ns_conn form]
set pop    [ns_set get $form p $pop]
set random [ns_set get $form r $random]
set trace  [ns_set get $form t $trace]
set ::heap::trace $trace
set traceVars [list q p n]
if {$trace} {

    proc ::tracer {varname op args} {
        upvar #0 $varname loc 
        ns_log Notice "$varname value = $loc op=$op args = $args"
        rec log "trace $varname value = $loc op=$op args = $args"
    }
    foreach var $traceVars {
        global $var
        trace add variable $var read "::tracer $var r"
        trace add variable $var write "::tracer $var w"
    }
}

::heap::new {{entry 0}} {
    variable size
    set heapEntry [list $size "e$size" $entry]
} {
    variable heap
    expr {[lindex $heap $a 2] < [lindex $heap $b 2]}
}

proc pushRandom {n min max} {
    for {set i 0} {$i<$n} {incr i} {
        ::heap::push [::heap::newEntry [expr {int(([ns_rand] * ($max - $min) )+ $min)}]]
    }
}

if {$random} {
    pushRandom $random 2 300
}

::heap::initHeap 

set h $::heap::heap

for {set i 0} {$i < $pop && $::heap::size > 1} {incr i} {
    lappend poppedValues [lindex [::heap::pop] 2]
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
  <label for='t'>Trace Permute Vars</label>
  <input name='t' id='t' value='$trace'>
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
<a href='source.tcl?5'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
h = '$h'
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
