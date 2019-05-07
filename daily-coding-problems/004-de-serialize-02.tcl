
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
    variable left
    variable right
    variable val

    if {$left eq "None"} {
        set serializedLeft "None"
    } else {
        set serializedLeft \[[<< $left.serialize >>]\]
    }

    if {$right eq "None"} {
        set serializedRight "None"
    } else {
        set serializedRight \[[<< $right.serialize >>]\]
    }

    return "<< ::Node::Node -val \"$val\" -left $serializedLeft -right $serializedRight >>"

} PUBLIC >>

<< ::Node::Node.method deserialize {serializedValue} {
    eval $serializedValue
} PUBLIC >>


#node = Node('root', Node('left', Node('left.left')), Node('right'))
set root [<< ::Node::Node -val 'root' -left [<< ::Node::Node -val 'left' -left [<< ::Node::Node -val 'left.left' >>] >>] -right [<< ::Node::Node -val 'right' >>] >>]

ns_return 200 text/html "
<html>
<head>
<title>Serialize/Deserialize Node Structure</title>
</head>
<body>

<a href='004-de-serialize-02.tcl.txt'>Source Code</a><br>
<a href='004-de-serialize-explained.txt'>Solution Explained</a>
<pre>
Create root node like this:
set root \[<< ::Node::Node -val 'root' -left \[<< ::Node::Node -val 'left' -left \[<< ::Node::Node -val 'left.left' >>] >>] -right \[<< ::Node::Node -val 'right' >>] >>]


root = $root
root.left = [<< $root.left >>]
root.left.val = [<< [<< $root.left >>].val >>]
root.left.left.val = [<< [<< [<< $root.left >>].left >>].val >>]

<< \$root.serialize >> = [<< $root.serialize >>]


\[<< \[<< \[<< \[<< \$root.deserialize \[<< \$root.serialize >>] >>].left >>].left >>].val >>] = [<< [<< [<< [<< $root.deserialize [<< $root.serialize >>] >>].left >>].left >>].val >>]
</pre>
</body>
</html>"