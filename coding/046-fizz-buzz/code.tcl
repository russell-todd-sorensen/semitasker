set problem {
    # Enter problem description, exactly started
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

proc isFizzBuzz {val} {
    #set result [list Fizz $val Buzz]
    set result [list]
    set tmp ""
    if {$val % 3} {
        set tmp $val
    } else {
        lappend result Fizz
    }
    if {$val % 5} {
        lappend result $tmp
    } else {
        lappend result Buzz
    }

    join $result ""
}
proc isFizzBuzz2 {val} {
    set tmp ""
    if {$val % 3} {
        set tmp $val
    } else {
        append result Fizz
    }
    if {$val % 5} {
        append result $tmp
    } else {
        append result Buzz
    }

    return $result
}

set v 0
set m ""

set form [ns_conn form]
set v [ns_set get $form v $v]
set m [ns_set get $form m $m]

set result [isFizzBuzz$m $v]

switch -exact -- $m {
    2 {
        set mChecked ""
        set mChecked2 checked
    }
    default {
        set mChecked checked
        foreach num [list 2] {
            set mChecked$num ""
        }
    }
}

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>FizzBuzz in Tcl</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='v'>Number to Eval</label>
  <input name='v' id='v'  value='$v'>
 </li>
 <li>
  <label for='mmm'>Method Selection</label><br>
  <label for='m1'>Original</label>
  <input type='radio' name='m' id='m1' value='' $mChecked >
  <label for='m2'>Extra Crispy</label>
  <input type='radio' name='m' id='m2' value='2' $mChecked2 >
 </li>
 <li>
  <input type='submit' value='Check If FizzBuzz'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
v = '$v'
result = '$result'
</pre>
</body>
</html>"
