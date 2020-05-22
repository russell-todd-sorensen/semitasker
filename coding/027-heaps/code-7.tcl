set problem {
    # Enter problem description, exactly started
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
}

namespace eval ::rec {
    variable data ;# an array
}

proc ::rec::new {name} {
    variable data
    set ns [uplevel namespace current]
    
    set data(${ns}::$name) [list]
    proc ${ns}::$name [list what {args ""}] "
        variable data
        set name $name
        set ns $ns
        lappend data(${ns}::$name) \"\$what \$args\"
    " 
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
    variable size 0
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
    global count
    
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
        incr count
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
        incr count
        lset heap $q [lindex $heap $p]
        set q $p
        set p [expr {$q>>1}]
    }
    incr count
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
    #set heap [list $entry $entry {*}[lrange $heap 1 end]]
    set heap [lreplace $heap -1 0 $entry $entry]

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
    if {$size > 0} {
        #ns_log Notice "pop size=$size popped = $popped"
        permute 1 $size
    }
    #rec log "::heap::pop popped $popped, new heap='$heap'"
    return $popped
}

global count start finish filterList
set count 0
set start 0
set finish 0

proc ::heap::initHeap {} {
    global start finish count
    set begin [clock microseconds]
    set total 0
    variable size
    set i 1
    set n $size
    set j [expr {$n/2 + 1}]
    #rec log "initHeap input = '$::heap::heap'"
    while {$j > 1} {
        incr j -1
        add0 [peek $j]
        set start [clock microseconds]
        permute $j $n
        set finish [clock microseconds]
        set elapsed [expr {$finish - $start}]
        incr total $elapsed
        #rec log "i = '$i', n = '$n', j='$j', count = $count, elapsed='$elapsed', total='$total'"
        incr i
    }
    set end [clock microseconds]
    #rec log "finished initHeap heap = $::heap::heap"
    ns_log Notice "***Total Elapsed: count='$count', end='$end', begin='$begin', total='[expr {$end - $begin}]' microseconds"
}
set hs 1
set h 0
set random 0
set pop 0
set verified 0
set popall 0
set poppedValues [list]
set previousHeap [list]
set trace false
set values [list]
set min 0
set max 100
set filterList 0

set form   [ns_conn form]
set pop    [ns_set get $form p $pop]
set popall [ns_set get $form pa $popall]
set random [ns_set get $form r $random]
set trace  [ns_set get $form t $trace]
set values [ns_set get $form v $values]
set min    [ns_set get $form min $min]
set max    [ns_set get $form max $max]
set filterList [ns_set get $form f $filterList]


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
    set heapEntry [list $size "e$size" $entry 1]
} {
    variable heap
    expr {[lindex $heap $a 2] < [lindex $heap $b 2]}
}

proc pushRandom {n min max {values {}}} {
    global preFilterHeapSize filterList
    set start [clock microseconds]
    rec log "pushRandom starting at $start"
    set tmpHeap []
    if {[llength $values] > 0} {
        set n [llength $values]
        rec log "set n to $n"
    }
    for {set i 0} {$i<$n} {incr i} {
        if {[llength $values] > 0} {
            set revI [expr {$n -1 -$i}]
            set newE [::heap::newEntry [lindex $values $revI]]
            #rec log "added supplied value [lindex $values $revI] as newEntry $newE to heap"
        } else {
            set newE [::heap::newEntry $i]
            set newE [::heap::newEntry [expr {int(([ns_rand] * ($max - $min) )+ $min)}]]
            #rec log "added sequential value $i as $newE to heap"
        }
        lappend tmpHeap $newE
        incr ::heap::size
    }
    #rec log "prefilter Heap = $tmpHeap"
    set preFilterHeapSize $::heap::size
    if {$filterList} {
        set tmpList [filterList $tmpHeap]
        set tmpHeap [lindex $tmpList 1]
        set size    [lindex $tmpList 0]
        set ::heap::size $size
        set tmpHeap [lrange $tmpHeap 0 $size-1]
    }
    set ::heap::heap [lreplace $tmpHeap -1 -1 [lindex $tmpHeap 0]]
    #rec log "***size=$::heap::size heap = $::heap::heap"
    set end [clock microseconds]
    rec log "finished in [expr {$end - $start}] microseconds"
}

proc filterList {preHeap} {
    global count
    set len [llength $preHeap]
    set maxMax $len
    set minFound  0
    set maxFound  0
    set dup0      0
    set duplicate 0
    set deleted   0
    #rec log "filterList 0: preHeap = $preHeap"
    for {set i 0} {$i < $len} {incr i} {
        incr count
        set entry [lindex $preHeap $i]
        set val [lindex $entry 2]
        #rec log "filterList 1: i = $i, entry=$entry"
        if {$val < 1 || $val > $maxMax} {
            incr len -1
            incr maxMax -1
            #rec log "filterList 2: $val < 1 moving '[lindex $preHeap $len]' to $i"
            lset preHeap $i [lindex $preHeap $len]
            incr i -1
        }
    }
    return [list $len $preHeap]
}

global preFilterHeapSize
set preFilterHeapSize 1

if {$random} {
    pushRandom $random $min $max $values
}

::heap::initHeap 

set h $::heap::heap

set minGood  1
set maxFound 0
set found -1;
set poppedValues []
set hs $::heap::size
if {$hs == 0} {
    set hs 1
}
if {$popall > 1} {
    rec log "pop $popall"
    for {set i 0} {$i < $popall && $::heap::size >= 1} {incr i} {
        lappend poppedValues [lindex [::heap::pop] 2]
    }
} elseif {$popall} {
    rec log "pop all $popall"
    for {set i 0} {$::heap::size >= 1} {incr i} {
        lappend poppedValues [lindex [::heap::pop] 2]
    }
} else {
    for {set i 0} {$i < $hs} { incr i} {
        set popped [::heap::pop]
        set poppedValue [lindex $popped 2]
        lappend poppedValues $poppedValue
        #rec log "popped $popped value = $poppedValue minGood = $minGood"
        if {$poppedValue == $minGood } {
            incr minGood
        } elseif {$poppedValue > $minGood} {
            set found $minGood
            break;
        }
    }
}
rec log "original found = $found"
if {$found == -1} {
    set found $minGood
}

if {$filterList} {
    set filterChecked checked
} else {
    set filterChecked ""
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
  <label for='pa'>Pop All:</label>
  <input type='number' name='pa' id='pa' value='$popall' min='0'>
 </li>
 <li>
  <label for='v'>Int Values:</label>
  <input type='text' name='v' id='v' value='$values'>
 </li>
 <li>
  <label for='min'>Min Value</label>:
  <input name='min' id='min' value='$min'>
 </li>
 <li>
  <label for='max'>Max Value</label>:
  <input name='max' id='max' value='$max'>
 </li>
 <li>
  <label for='f'>Filter List</label>:
  <input type='checkbox' name='f' id='f' value='1' $filterChecked>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?5'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
count = '$count'
heap::size = $hs filtered from $preFilterHeapSize
average filtered Heap = [expr {(0.0 + $count)/($hs)}]
averate preFiltered Heap = [expr {(0.0 + $count)/($preFilterHeapSize)}] ($preFilterHeapSize)
h = '\$h'
min = '$min'
max = '$max'
verified = '$verified'
popped values = '$poppedValues'
found = '$found'
remain = \$::heap::heap
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
