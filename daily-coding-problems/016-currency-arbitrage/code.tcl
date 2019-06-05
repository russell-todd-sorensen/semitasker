set problem {
    # Enter problem description, exactly started
Suppose you are given a table of currency exchange
rates, represented as a 2D array. Determine whether
there is a possible arbitrage: that is, whether
there is some sequence of trades you can make,
starting with some amount A of any currency, so
that you can end up with some amount greater than
A of that currency.

There are no transaction costs and you can trade
fractional quantities.

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
  <label for='b'>Input List</label>
  <input name='b' id='b'  value='$b'>
 </li>
 <li>
  <label for='a'>Target (k)</label>
  <input name='a' id='a' value='$a'>
 </li>
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
