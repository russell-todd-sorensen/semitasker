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

proc isFizzBuzz1 {val {ignore ""}} {
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

proc isFizzBuzz2 {val {ignore ""}} {
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

proc isFizzBuzz3 {val {ignore ""}} {
    set sum 0
    set ival 1
    set divs {3 5}
    foreach num $divs {
        incr sum [expr {($val%$num)?0:$ival}]
        set ival [expr {$ival*2}]
    }
    return [lindex [list $val Fizz Buzz FizzBuzz] $sum]
}

proc isFizzBuzzM {val {map {3 Fizz 5 Buzz}}} {
    
    set result [list]
    set len 0
    foreach {div name} $map {
        if {$val%$div} {
            continue
        }
        incr len
        append result $name 
    }
    expr {$len?$result:$val}
}

proc isFizzBuzzN {val {map {3 Fizz 5 Buzz}}} {
    
    set result [list]
    set len 0
    foreach {div name} $map {
        if {$val%$div} {
            continue
        }
        incr len
        append result $name 
    }
    if {$len} {
        return $result
    } else {
        return $val
    }
}

set v 0
set m "1"
set d [list 3 Fizz 5 Buzz]

set form [ns_conn form]
set v [ns_set get $form v $v]
set m [ns_set get $form m $m]
set d' [ns_set get $form d $d]

if {$m == "N" || $m == "M"} {
    set d ${d'}
}

set result [isFizzBuzz$m $v $d]

foreach num [list 1 2 3 M N] {
    set mChecked$num ""
}
set mChecked$m checked

set argList [list]
foreach arg [info args isFizzBuzz$m] {
    if {[info default isFizzBuzz$m $arg __defValue]} {
        lappend argList [list $arg $__defValue]
    } else {
        lappend argList $arg
    }
}

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>FizzBuzz in Tcl</title>
<style>
.display-none {
    display:none;
}
label.method {
    display:block;
} 
</style>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='v'>Number to Eval</label>
  <input name='v' id='v' value='$v'>
 </li>
 <li id='methods'>
  <label for='mmm'>Method Selection</label>
  <label for='m3' class='method'>
    <input type='radio' name='m' id='m1' value='1' $mChecked1 >Original</label>
  <label for='m2' class='method'>
    <input type='radio' name='m' id='m2' value='2' $mChecked2 >Extra Crispy</label>
  <label for='mM' class='method'>
    <input type='radio' name='m' id='m3' value='3' $mChecked3 >Baked</label>
  <label for='m1' class='method'>
    <input type='radio' name='m' id='mM' value='M' $mCheckedM >Breadcrumbs</label>
  <label for='mN' class='method'>
    <input type='radio' name='m' id='mN' value='N' $mCheckedN >Panko!</label>
 </li>
 <li>
 <label for='d'>BC/Panko Factor-Word List</label>
 <input id='d' class='' name='d' value='$d' />
 </li>
 <li>
  <input type='submit' value='Check If FizzBuzz'/>
 </li>
 </ul>
</form>
<a href='source.tcl?2'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
v = '$v'
result = '$result'

The method used:
proc isFizzBuzz$m {$argList} {[info body isFizzBuzz$m]}
</pre>
<h4>Disassembly</h4>
<pre>
[::tcl::unsupported::disassemble proc isFizzBuzz$m]
</body>
</html>"