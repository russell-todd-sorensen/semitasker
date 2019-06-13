set problem {
    # Enter problem description, exactly started
Given the root to a binary search tree, find the
second largest node in the tree.

}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
}

if {[namespace exists ::btree]} {
    namespace delete ::btree
}


namespace eval ::btree {
    variable nodeId 0;# shared across all btrees
    variable node ;# array with nodeId as array names
    variable trees ;# array to store different binary trees
    variable rootNodeName -ROOT-
}

proc ::btree::newTree {name} {
    variable trees
    variable rootNodeName
    if {[info exists trees($name)]} {
        return $name
    }
    set trees($name) [list $rootNodeName]
    return $name
}

proc ::btree::exists {name} {
    variable trees
    info exists trees($name)
}
proc ::btree::rootNode {name} {
    variable trees
    if {[info exists trees($name)]} {
        return $trees($name)
    } else {
        return [list]
    }
}

proc ::btree::newNode {value} {
    variable nodeId
    variable node
    incr nodeId
    set node($nodeId) [list $value]
    return $nodeId
}

proc ::btree::valueOf {nodeId} {
    variable node
    return [lindex $node($nodeId) 0]
}

proc ::btree::build {tree args} {
    if {![exists $tree]} {
        newTree $tree
    }
    foreach value $args {
        insert $tree $value
    }
}

proc ::btree::insert {tree value} {
    variable node
    set root [rootNode $tree]
    set state [llength $root]

    if {$state == 0} {
        newTree
        incr state
    }

    switch -exact -- $state {
        1 {
            if {$value eq ""} {
                lappend node($tree) [newNode $value]
            } else {
                lappend node($tree) [newNode ""] [newNode $value]
            }
        }
        2 {
            set compare [string compare $value [valueOf [lindex $root 1]]
            if {$compare > 0} {
                lappend node($root) [newNode $value]
            }
        }
    }

}

proc ::btree::find {tree value} {

}

proc ::btree::remove {tree value} {

}

proc ::btree::delete {tree} {

}

set tree "a bb e yd du nt zx br ud a-"
set val 0
set find false
set print false

set form  [ns_conn form]
set tree  [ns_set get $form t $tree]
set val   [ns_set get $form v $val]
set find  [ns_set get $form f $find]
set print [ns_set get $form p $print]

set treeName T

::btree::build $treeName $tree

if {$find == "true"} {
    set result [::btree::find $treeName $find]
} else {
    set result [::btree::insert $treeName {*}$val]
}

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Fill In Something Useful</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='t'>Tree Values (Serialized)</label>
  <input name='t' id='t'  value='$t'>
 </li>
 <li>
  <label for='v'>Add Values</label>
  <input name='v' id='v'  value='$v'>
 </li>
 <li>
  <label for='f'>Find</label>
  <input type='checkbox' value='true' name='f' id='f' value='$f'>
 </li>
 <li>
  <label for='f'>Print</label>
  <input type='checkbox' value='true' name='p' id='p' value='$p'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
v = '$v'
f = '$f'
p = '$p'
result = '$result'
</pre>
</body>
</html>"
