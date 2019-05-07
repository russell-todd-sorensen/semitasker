set problem {
Given the root to a binary tree, implement
serialize(root), which serializes the tree
into a string, and deserialize(s), which
deserializes the string back into the tree.

For example, given the following Node class

class Node:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
The following test should pass:

node = Node('root', Node('left', Node('left.left')), Node('right'))
assert deserialize(serialize(node)).left.left.val == 'left.left'

}

set solution {
    Tcl is not an OO language, but it can be done
}

if {[namespace exists ::Node]} {
    namespace delete ::Node
}
namespace eval :: {
    source "d:/git-repos/wtk/init.tcl"
}

<< Class ::Node::Node \
    -ObjNameFormat NODE_NODE%0.3i \
    -ObjCounter 0 \
    -VARIABLES {{left None - {}} {right None - {}} {val Blank - {}}} \
    +METHODS serialize \
    +METHODS deserialize \
    +METHODS left \
    +METHODS right \
    +METHODS val \
>>

<< ::Node::Node.method left {} {
    variable left
    return $left
} PUBLIC >>

<< ::Node::Node.method right {} {
    variable right
    return $right
} PUBLIC >>

<< ::Node::Node.method val {} {
    variable val
    return $val
} PUBLIC >>

<< ::Node::Node.method serialize {} {

} PUBLIC >>

<< ::Node::Node.method deserialize {} {

} PUBLIC >>

set left1 [<< ::Node::Node -val left >>]
set root [<< ::Node::Node.new -left $left1 >>]

set root2 [<< ::Node::Node.new -val "abc" >>]

set vars [info vars ::Node::Node::*]
set children [namespace children ::Node::Node]

set childVals [list]
foreach child $children {
    lappend childVals "--$child"
    set vars [info vars ${child}::*]
    foreach var $vars {
        if {[array exists $var]} {
            set names [array names $var]
            foreach name $names {
                lappend childVals "  [namespace tail ${var}]($name) = [set ${var}($name)]"
            }

        } elseif {[info exists $var]} {
            lappend childVals "  [namespace tail $var] = [set $var]"
        }
    }
}

ns_return 200 text/plain "[namespace children ::Node]
root = $root
root.left = [<< $root.left >>]
root.left.val = [<< [<< $root.left >>].val >>]
root2.val = [<< $root2.val >>]

vars = '$vars'

children of ::Node::Node = '$children'


values =
[join $childVals \n]

Node 1 val = [<< NODE_NODE001.val >>]
"