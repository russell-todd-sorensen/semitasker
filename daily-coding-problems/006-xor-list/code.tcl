set problem {
    An XOR linked list is a more memory efficient doubly
    linked list. Instead of each node holding next and
    prev fields, it holds a field named both, which is
    an XOR of the next node and the previous node.
    Implement an XOR linked list; it has an add(element)
    which adds the element to the end, and a get(index)
    which returns the node at index.

    If using a language that has no pointers
    (such as Python), you can assume you have access to
    get_pointer and dereference_pointer functions that
    converts between nodes and memory addresses.
}

set solution {
    In Tcl every pointer has a name. I will use one Tcl array
    (hash array) to represent individual list entries, where
    the key will be the memory address.
}

namespace eval ::xor {
    variable listId
    variable initialized 0
}

proc ::xor::init { } {
    variable listId
    variable initialized

    if {!$initialized} {
        set listId 0
    }
    foreach child [namespace children [namespace current]] {
        namespace delete $child
    }
    return [set initialized 1]
}

proc ::xor::add {listName value} {
    set index ${listName}::index
    if {$index == 0} {
        set ptr ${listName}::nodes(root)
    }

}

proc ::xor::newList { {max 100} } {

    variable listId
    variable initialized

    if {!$initialized} {
        init
    }

    set listName L$listId
    namespace eval $listName {
        variable index 0
        variable nodes
        variable max
        variable root
        variable prev
        variable next
        variable memoryPointers [list]
        proc getMemoryPtr { } {
            variable max
            variable memoryPointers
            set tries 1
            while {[set ptr [expr round($max * rand())]] == 0
                || [lsearch $memoryPointers $ptr] != -1
            } {
                incr tries
            }
            lappend memoryPointers $ptr
            ns_log Notice "tries = $tries"
            return $ptr
        }
        proc add {value} {
            variable index
            variable nodes
            variable prev
            variable next
            variable prevBoth
            variable curr [getMemoryPtr]

            if {$index == 0} {
                variable root $curr
                set prev 0
                set next 0
                set prevBoth $curr
                set both [expr $prev ^ $next] ;# == 0
                set nodes($curr) [list $both $index $value]
                set prev $curr
            } else {
                set prevBoth [lindex $nodes($prev) 0]
                set newPrevBoth [expr {$prevBoth ^ $curr}]
                lset nodes($prev) 0 $newPrevBoth
                set nodes($curr) [list $prev $index $value]
                set prev $curr
            }
            #set nodes($curr) [list $prev $index $value] ;# temp add $index
            incr index
        }
        proc print {} {
            variable nodes
            variable root
            ns_log Notice "[array get nodes]"
            set index 0
            set prev 0
            ns_log Notice "Looking for nodes($root)..."
            set data $nodes($root)
            set curr $root
            set both  [lindex $data 0]
            set idx   [lindex $data 1]
            set value [lindex $data 2]
            set next  [expr $both ^ $prev]
            set result \n[format %10s%10s%10s%10s%40s Idx Both Curr Next Value]\n
            append result [format %10s%10s%10s%10s%40s $idx $prev $root $next $value]\n
            #set result "\n$idx $prev $root $next $value\n"
            set prev $curr
            while {true} {
                ns_log Notice "Looking for nodes($next)...."
                set data $nodes($next)
                set curr $next
                set both  [lindex $data 0]
                set idx   [lindex $data 1]
                set value [lindex $data 2]
                set next  [expr $both ^ $prev]
                #append result "$idx $prev $curr $next $value\n"
                append result [format %10s%10s%10s%10s%40s $idx $prev $curr $next $value]\n
                set prev $curr
                if {![info exists nodes($next)]} {
                    break
                }
            }
            return $result
        }

        proc get {indexToGet} {
            variable nodes
            variable root
            ns_log Notice "[array get nodes]"
            set index 0
            set prev 0
            ns_log Notice "Looking for nodes($root)..."
            set data $nodes($root)
            set curr $root
            set both  [lindex $data 0]
            set idx   [lindex $data 1]
            set value [lindex $data 2]
            set next  [expr $both ^ $prev]
            set prev $curr
            while {$index != $indexToGet} {
                ns_log Notice "Looking for nodes($next)...."
                set data $nodes($next)
                set curr $next
                set both  [lindex $data 0]
                set idx   [lindex $data 1]
                set value [lindex $data 2]
                set next  [expr $both ^ $prev]

                set prev $curr
                incr index
                if {![info exists nodes($next)] && ($index != $indexToGet)} {
                    set value "Index $indexToGet Not Found"
                    break
                }
            }
            return $value
        }
    }

    set ${listName}::max $max

    incr listId

    return $listName
}

set max 1000
set nodes 100
set get 10

set form  [ns_conn form]
set max   [ns_set get $form m $max]
set nodes [ns_set get $form n $nodes]
set get   [ns_set get $form g $get]

set listName [::xor::newList $max]

set len [::xor::${listName}::add "My first List Item"]
set len [::xor::${listName}::add "My Second List Item"]
set len [::xor::${listName}::add "My Third List Item"]

for {set i 4} {$i < $nodes} {incr i} {
    set len [::xor::${listName}::add "My #$i List Item"]
}

set result [::xor::${listName}::print ]

foreach getIndex $get {
    lappend gets "value at $getIndex = '[::xor::${listName}::get $getIndex]'"
}

ns_return 200 text/html "
<html>
<head>
<title>Doubly Linked List With XOR Not Prev Next (Namespace Version)</title>
</head>
<body>
<form>
<ul>
 <li>
  <label for='m'>Max Address</label>
  <input name='m' id='m'  value='$max'>
 </li>
 <li>
  <label for='n'>Nodes to Make</label>
  <input name='n' id='n' value='$nodes'>
 <li>
 <li>
  <label for='g'>Nodes to Get</label>
  <input name='g' id='g' value='$get'>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
max = '$max'
nodes = '$nodes'
listName = '$listName'
len = '$len'
root = '[set ::xor::${listName}::root]'
result = '$result'


[join $gets \n]
</pre>
</body>
</html>"
