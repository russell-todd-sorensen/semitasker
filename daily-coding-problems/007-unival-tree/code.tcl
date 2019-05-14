set problem {
    A unival tree (which stands for "universal value")
    is a tree where all nodes under it have the same
    value.

    Given the root to a binary tree, count the number
    of unival subtrees.

    For example, the following tree has 5 unival subtrees:

       0
      / \
     1   0
        / \
       1   0
      / \
     1   1
}

set solution {
    Both Leaf Nodes are the same or both null.
}

proc getUnivalTreeSum {args} {
    return "todo"
}

set a todo
set b todo

set form [ns_conn form]
set a [ns_set get $form a $a]
set b [ns_set get $form b $b]

set result [illuminatingProcName $a $b]

ns_return 200 text/html "
<html>
<head>
<title>Fill In Something Useful</title>
</head>
<body>
<form>
<ul>
 <li>
  <label for='b'>Input List</label>
  <input name='b' id='b'  value='$b'>
 </li>
 <li>
  <label for='a'>Target (k)</label>
  <input name='a' id='a' value='$a'>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
a = '$a'
b = '$b'
</pre>
</body>
</html>"
