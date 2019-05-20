set problem {
    # Enter problem description, exactly started
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
}

proc illuminatingProcName {args} {
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
<form autocomplete='off'>
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
