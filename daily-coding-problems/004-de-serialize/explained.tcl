Problem as stated:

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


Solution: Tcl as I use it is not OO, but I have written and OO system:

Here's what the class/methods look like:

The "<<" is a procedure in Tcl which is used to construct objects. Classes are objects.
The first argument to "<<" is the name of the object, some objects like Class have
a well known name we can rely on not changing. The default method is "new", we could
call this as "<< Class.new ..."

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

Now the Node class exists and we can use it to define methods.

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


We create a new node like this:

set root [<< ::Node::Node -val 'root' >>]

Creating objects returns the name of the object as a handle, but we store it in
a variable so it is easier to work with.

If you wanted to immediately return the value of the root node, you could do this::

set value [<< [<< ::Node::Node -val 'root' >>].val >>]

value will be equal to 'root' (including the apos.)
