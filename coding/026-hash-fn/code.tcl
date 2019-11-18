set problem {
    # Enter problem description, exactly started
    Examine hash function used in Tcl for various
    properties.
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
}

global log
set log [list]

proc rec {logName what} {
    global $logName
    lappend $logName $what
}

proc printLog {logName {joinBy \n} {reset 0}} {
    global $logName
    set result [join [set $logName] $joinBy]
    if {$reset} {
        set $logName [list]
    }
    return $result
}

#    for (c=*string++ ; c ; c=*string++) {
#        result += (result<<3) + c;
#     }
#     return result;
#
global hashFn

proc tclHash {str base} {

    set hash 0
    foreach char [split $str ""] {
        set hash [expr { (($hash<<3) + [scan $char %c])%(1<<$base)}]
        ns_log Notice "hash for $str now $hash"
    }
    return $hash
}

proc tclHashDJB2 {str base} {

    set hash 5381
    foreach char [split $str ""] {
        set hash [expr { ((($hash<<5) + $hash ) + [scan $char %c])%(1<<$base)}]
        ns_log Notice "hash for $str now $hash"
    }
    return $hash
}

set hashFn(0) tclHash 
set hashFn(1) tclHashDJB2

proc tclHashs {keys {fid 0} {base 32}} {
    global hashFn
    foreach key $keys {
        lappend result [$hashFn($fid) $key $base]
    }
    return $result
}

set keys [list aa bb c d e f g]
set fid 0
set base 32
set size 100

set form [ns_conn form]
set keys [ns_set get $form k $keys]
set fid  [ns_set get $form fid $fid]
set base [ns_set get $form b $base]
set size [ns_set get $form s $size]

set hashs [tclHashs $keys $fid $base]

set options "<table cellspacing='0' cellpadding='5' border='1'>
<tr><th>Select</th><th>Hash Body</th></tr>\n"
foreach fnId [lsort -integer -increasing [array names hashFn]] {
    if {$fnId == $fid} {
        set checked " checked"
    } else {
        set checked ""
    }
    append options "<tr><td><input name='fid' id='fid' type='radio' value='$fnId'$checked></td>
    <td ><pre>$hashFn($fnId) : \n[info body $hashFn($fnId)]</pre></td></tr>\n"
} 
append options "\n</table>"

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Hash Function Demonstration and Evaluation</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='fid'>Hash Function</label>
  $options
 </li>
 <li>
  <label for='k'>Input Keys List</label>
  <input name='k' id='k'  value='$keys'>
 </li>
 <li>
  <label for='b'>Base </label>
  <input name='b' id='b' type='numeric' min='2' max='32' value='$base'>
 </li>
 <!--
 <li>
  <label for='s'>Table Size </label>
  <input name='s' id='s' type='numeric' min='2' max='1000' value='$size'>
 </li>
 -->
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
keys = '$keys'
hashs = '$hashs'
</pre>
</body>
</html>"
