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

    In this global version of the solution, I will use the global namespace
}

global ListId
global ListNames
global memoryPointers
global max nodes get


set ListNames [list]
set ListId 0
set memoryPointers [list]
set max 1000
set nodes 100
set get 10

set form  [ns_conn form]
set max   [ns_set get $form m $max]
set nodes [ns_set get $form n $nodes]
set get   [ns_set get $form g $get]

proc init { listName } {

    upvar #0 $listName.root root
    upvar #0 $listName.indx indx
    upvar #0 $listName.curr curr
    upvar #0 $listName.prev prev
    upvar #0 $listName.both both
    upvar #0 $listName.next next

    set root 0
    set indx 0
    set curr 0
    set prev 0
    set both 0
    set next 0

    return $listName
}

proc getMemoryPtr { } {
    global max memoryPointers
    set tries 1
    while {[set ptr [expr round($max * rand())]] == 0
        || [lsearch $memoryPointers $ptr] != -1
    } {
        incr tries
    }
    lappend memoryPointers $ptr
    return $ptr
}

proc newList { } {
    global ListId ListNames
    set listName XOL$ListId
    lappend ListNames $listName
    incr ListId
    return [init $listName]
}

proc add { listName value } {

    upvar #0 $listName.root root
    upvar #0 $listName.indx indx
    upvar #0 $listName.curr curr
    upvar #0 $listName.prev prev
    upvar #0 $listName.both both
    upvar #0 $listName.next next

    set curr [getMemoryPtr]
    if {$indx == 0} { # root node
        set root $curr
        set prev 0
        set next 0
        set both [expr $prev ^ $next] ;# == 0
        upvar #0 $listName.$curr $listName.$curr
        set $listName.$curr [list $both $value]
        set prev $curr
    } else {
        upvar #0 $listName.$prev $listName.$prev
        upvar #0 $listName.$curr $listName.$curr
        set prevBoth [lindex [set $listName.$prev] 0]
        set newPrevBoth [expr {$prevBoth ^ $curr}]
        lset $listName.$prev 0 $newPrevBoth
        set $listName.$curr [list $prev $value]
        set prev $curr
    }
    incr indx
}

proc print { listName } {
    upvar #0 $listName.root root
    set index 0
    set prev 0
    upvar #0 $listName.$root rootData
    set curr $root
    set both  [lindex $rootData 0]
    set value [lindex $rootData 1]
    set next  [expr $both ^ $prev]
    set hFormat %10s%10s%10s%10s%10s%30s
    set hFields [list Idx Curr Prev Both Next Value]
    set result \n[format $hFormat {*}$hFields ]\n
    append result [format $hFormat $index $curr $prev $both $next $value]\n
    set prev $curr
    while {true} {
        incr index ;# just used for printing
        upvar #0 $listName.$next data
        set curr $next
        set both  [lindex $data 0]
        set value [lindex $data 1]
        set next  [expr $both ^ $prev]
        append result [format $hFormat $index $curr $prev $both $next $value]\n
        set prev $curr

        if {![info exists ::$listName.$next]} {
            break
        }
    }
    return $result
}

proc get {listName indexToGet} {

    upvar #0 $listName.root root

    set index 0
    set prev 0
    upvar #0 $listName.$root rootData
    set curr $root
    set both  [lindex $rootData 0]
    set value [lindex $rootData 1]
    set next  [expr $both ^ $prev]
    set prev $curr

    while {$index != $indexToGet} {
        upvar #0 $listName.$next data
        set curr $next
        set both  [lindex $data 0]
        set value [lindex $data 1]
        set next  [expr $both ^ $prev]
        set prev $curr
        incr index
        if {![info exists ::${listName}.$next] && ($index != $indexToGet)} {
            set value "Index $indexToGet Not Found"
            break
        }
    }
    return $value
}


set listName [newList]
ns_log Notice [info vars]
set len [add $listName "something here"]
ns_log Notice [info globals]
set len [add $listName "Something else"]
ns_log Notice [info globals]

for {set i 2} {$i < $nodes} {incr i} {
    set len [add $listName "My #$i List Item"]
}

set result [print $listName]
set gets [list]

foreach getIndex $get {
    lappend gets "value at $getIndex = '[get $listName $getIndex]'"
}

ns_return 200 text/html "
<html>
<head>
<title>Doubly Linked List With XOR Not Prev Next (Global Version)</title>
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
<a href='source-global.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
max = '$max'
nodes = '$nodes'
listName = '$listName'
len = '$len'
root = '[set ::${listName}.root]'
result = '$result'


[join $gets \n]
</pre>
</body>
</html>"