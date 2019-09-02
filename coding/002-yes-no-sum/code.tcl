set problem {
    Given a list of numbers and a number k, return
    whether any two numbers from the list add up to k.

    For example, given [10, 15, 3, 7] and k of 17,
    return true since 10 + 7 is 17.

    Bonus: Can you do this in one pass?
}

set solution {
    create an array sparse 1..k
    For each number calculate the
    inverse k-n and check if it is
    in the array.
    At most you have to traverse all
    elements of the list. No takes longer.
}

proc findIfPairExists {target inList} {

    set pairExists false
    foreach num $inList {
        if {[info exists p([expr {$target -$num}])]} {
            set pairExists true
            break
        } else {
            set p($num) $num
        }
    }
    return $pairExists
}

set form [ns_conn form]
set target [ns_set get $form t 17]
set inList [ns_set get $form in {10 15 3 1 0 5 22 9 2 7}]

set result [findIfPairExists $target $inList]

ns_return 200 text/html "
<html>
<head>
<title>2 Elements of '$inList' sum to '$target'</title>
</head>
<body>
<form>
<ul>
 <li>
  <label for='in'>Input List</label>
  <input name='in' id='in'  value='$inList'>
 </li>
 <li>
  <label for='t'>Target (k)</label>
  <input name='t' id='t' value='$target'>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.txt'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
inList = '\[[join $inList ,]\]' target (k) = '$target'
result = '$result'
</pre>
</body>
</html>"
