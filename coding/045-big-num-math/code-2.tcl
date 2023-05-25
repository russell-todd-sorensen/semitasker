set problem {
    # Using Tcl to calculate with large integers and
    # rational fractions expressed as repeating decimals.
}

set solution {
    # Simple arithmetic at first,
    # stage two is to develop a stack (rpn notation)
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

proc bigNumMath {m n o} {
    set m [string trimleft [string trim $m] 0]
    set n [string trimleft [string trim $n] 0]
    set op "-"

    switch -exact -- $o {
        "plus" {
            set result [expr {$m + $n}]
            set op "+"
        }
        "divided by" {
            if {$n == 0 || $n eq ""} {
                set result "divide by zero/null error"
            } else {
                set result [expr {$m / $n}]
            }
            set op "/"
        }
        "multiplied by" {
            set result [expr {$m * $n}]
            set op "*"
        }
        "raised to power of" {
            set result [expr {$m ** $n}]
            set op "**"
        }
        "m%n" {
            set result [expr {$m % $n}]
            set op "%"
        }
        "m%%n" {
            set result [expr {$n % $m}]
            set op "%%"
        }
        "minus" -
        default {
            set o "minus"
            set op "-"
            set result [expr {$m - $n}]
        }
    }
    return [list $m $o $n $op $result]
}

array set selected [list - "" + "" / "" * "" ** "" % "" %% ""]

set m 1
set n 1
set o "minus"

set form [ns_conn form]
set m [ns_set get $form m $m]
set n [ns_set get $form n $n]
set o [ns_set get $form o $o]

set resultList [bigNumMath $m $n $o]
set extra [lassign $resultList m o n op result]
set selected($op) selected

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
  <label for='m'>First Num</label>
  <input name='m' id='m' value='$m'>
 </li>
 <li>
  <label for='o'>Operation: </label>
  <select id='o' name='o'>
    <option value='minus' $selected(-)>Minus</option>
    <option value='plus' $selected(+)>Plus</option>
    <option value='divided by' $selected(/)>Int Divided By</option>
    <option value='m%n' $selected(%)>M Modulo N</option>
    <option value='m%%n' $selected(%%)>N Modulo M</option>
    <option value='multiplied by' $selected(*)>Multiplied by</option>
    <option value='raised to power of' $selected(**)>Raised to Power of</option>
  </select>
 </li>
 <li>
  <label for='n'>Second Num:</label>
  <input name='n' id='n' value='$n'>
 </li>
 <li>
  <input type='submit' value='Apply'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
m = '$m'
op = '$op' ($o)
n = '$n'

Result: ($m) $op ($n) = ($result)
Length of Result = ([string length $result])
</pre>
<h5>Aligned</h5>
<table >
<tr>
 <th>M</th>
 <td align='right'><code>$m</code></td>
</tr>
<tr>
 <th>Op</th>
 <td><code>$o</td>
</tr>
<tr>
 <th>N</th>
 <td align='right'><code>$n</code></td>
</tr>
<tr>
 <th><b> =</b></th>
 <td align='right'><code>$result</code></td>
</tr>
</table>

</body>
</html>"
