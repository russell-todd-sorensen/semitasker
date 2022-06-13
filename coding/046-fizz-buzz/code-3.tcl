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

proc ::iff {expr {?} ifTrue {:} ifNot } {
    uplevel [list if $expr $ifTrue else $ifNot]
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

proc isFizzBuzzO {val {map {3 Fizz 5 Buzz}}} {
    
    set result [list]
    set len 0
    foreach {div name} $map {
        if {$val%$div} {
            continue
        }
        incr len
        append result $name 
    }

    iff {$len} ? {return $result} : {return $val}
}


set v 0
set m "1"
set d [list 3 Fizz 5 Buzz]
set t [list 1 2000000 5]

set form [ns_conn form]
set v  [ns_set get $form v $v]
set m  [ns_set get $form m $m]
set d' [ns_set get $form d $d]
set t  [ns_set get $form t $t]

if {$m == "N" || $m == "M" || $m == "O"} {
    set d ${d'}
}

proc measure {t args} {
    set it [expr {int(ceil(10000./[lindex [time $args] 0]))}]
    set it [expr {int(ceil(2000000./[lindex [time $args $it] 0]))}]
    while {$it < $t} {set it $t}

    return [list [time $args $it] "$it iterations"]
}

proc measure3 {t args} {
    lappend t 2000000 5
    foreach var {remain maxMicroSec ramp} val $t {
        if {$var ne ""} {
            set $var $val 
            continue
        } else {
            break
        }
    }
    set t [lindex $t 0]
    set table [list]
    set i 1
    set usecs 0
    while {$remain > 0} {
        set usec [expr {[lindex [time $args $i] 0]}]
        incr remain -$i
        set time [expr {$usec * $i}]
        set usecs [expr {$usecs + $time}]
        lappend table [list $i $usec $usecs]
        if {$usecs < $maxMicroSec} {
            set i [expr {$i * $ramp}]
            set i [expr {$i<$remain?$i:$remain}]
        } else {
            set remain 0
        }
    }
    return $table
}
proc measure2 {t args} {
    return [list [time $args $t] "$t iterations"]
}
set iter [lindex $t 0]
set iter [expr {int($iter<1?1:($iter>2000000?2000000:$iter))}]
set t [list $iter {*}[lrange $t 1 end]]

if {$iter > 0} {
    set timingData [measure3 $t isFizzBuzz$m $v $d]
} else {
    set timingData "-not-performed-"
}

set result [isFizzBuzz$m $v $d]

foreach num [list 1 2 3 N M O] {
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
<title>FizzBuzz in Tcl with Exec Time</title>
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
  <label for='m1' class='method'>
    <input type='radio' name='m' id='m1' value='1' $mChecked1 >Original</label>
  <label for='m2' class='method'>
    <input type='radio' name='m' id='m2' value='2' $mChecked2 >Extra Crispy</label>
  <label for='m3' class='method'>
    <input type='radio' name='m' id='m3' value='3' $mChecked3 >Baked</label>
  <label for='mM' class='method'>
    <input type='radio' name='m' id='mM' value='M' $mCheckedM >Breadcrumbs</label>
  <label for='mN' class='method'>
    <input type='radio' name='m' id='mN' value='N' $mCheckedN >Panko!</label>
  <label for='mO' class='method'>
    <input type='radio' name='m' id='mO' value='O' $mCheckedO >iff</label>
 </li>
 <li>
 <label for='d'>BC/Panko/iff Factor-Word List</label>
 <input id='d' class='' name='d' value='$d' />
 </li>
 <li>
 <label for='t'>Timing Execution <br>{maxIter maxTime ramp}</label>
 <input id='t' name='t' type='text' min='1' step='1' max='1000000' value='$t' /><br>
 <span class='timing-data'>$timingData</span>
 <li>
  <input type='submit' value='Check If FizzBuzz'/>
 </li>
 </ul>
</form>
<a href='source.tcl?3'>Source Code</a><br>
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
</pre>
</body>
</html>"