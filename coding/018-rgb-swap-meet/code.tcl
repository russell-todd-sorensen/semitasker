set problem {
    # Enter problem description, exactly started
Given an array of strictly the characters 'R',
'G', and 'B', segregate the values of the array
so that all the Rs come first, the Gs come
second, and the Bs come last. You can only swap
elements of the array.

Do this in linear time and in-place.

For example, given the array
['G', 'B', 'R', 'R', 'B', 'R', 'G'],
it should become
['R', 'R', 'R', 'G', 'G', 'B', 'B'].

}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
I will simulate a null terminated array so that I
don't need to know the length of the array when I begin.
I'm going
}

if {[namespace exists ::rgb]} {
    namespace delete ::rgb
}

namespace eval ::rgb {
    variable start
    variable A ;# the array
    variable red 0
    variable green 0
    variable blue 0

}

proc ::rgb::solve {s} {
    variable start $s
    variable red 0
    variable green 0
    variable blue 0
    variable A

    toArray

    set i 0
    while {true} {
        switch -exact -- $A($i) {
            "R" {
                incr red
            }
            "G" {
                incr green
            }
            "B" {
                incr blue
            }
            "NULL"
            -
            default {
                break ;#out of the while
            }
        }
        incr i
    }

    if {$red > 0} {
        set R(index) 0
        set R(finished) false
        set R(end) [expr $red -1]
    } else {
        set R(finished) true
    }
    if {$green > 0} {
        set G(index) $red
        set G(end) [expr $red + $green -1]
        set G(finished) false
    } else {
        set G(finished) true
    }
    if {$blue > 0} {
        set B(index) [expr $red + $green]
        set B(end) [expr $red + $green + $blue -1]
        set B(finished) false
    } else {
        set B(finished) true
    }

    if {!$R(finished)} {
        for {set r $R(index)} {$i < $R(end)} {incr r} {
            switch -exact -- $A($r) {
                R {
                    incr R(index)
                }
                G {
                    set target $G(index)
                    while {target <= $G(end) } {
                        if {$A($target) eq "R"} {
                            swap $r $target
                        }
                    }
                }
            }
        }
    }
}

proc ::rgb::swap {ind1 ind2} {

    variable start
    variable A ;# the array
    variable red
    variable green
    variable blue

    set tmp $A($ind1)
    set A($ind1) $A($ind2)
    set A($ind2) $tmp
}

proc ::rgb::generate {r g b} {
    variable red $r
    variable green $g
    variable blue $b
    variable start
}

proc ::rgb::toArray { } {
    variable start
    variable A
    set i 0
    foreach char [split $start ""] {
        set A($i) $char
        incr i
    }

    set A($i) NULL
}

set startDefault "RGBRGBRGBRGBBBRBBBGB"
set r 5
set g 5
set b 10

set form [ns_conn form]
set start [ns_set get $form s $startDefault]
set r [ns_set get $form r $r]
set g [ns_set get $form g $g]
set b [ns_set get $form b $b]

if {($r == 0 && $g == 0 && $b == 0) && $startDefault ne $start} {
    # use start string, else generate
    set result ::rgb::solve $start
} else {
    set start [::rgb::generate $r $g $b]
    set result [::rgb::solve $start]
}


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
  <label for='s'>Fix Start:</label>
  <input name='s' id='s'  value='$start'>
 </li>
 <li>
  <label for='r'>Number of Rs</label>
  <input name='r' id='r'  value='$r'>
 </li>
 <li>
  <label for='g'>Number of Gs</label>
  <input name='g' id='g'  value='$g'>
 </li>
 <li>
  <label for='b'>Number of Bs</label>
  <input name='b' id='b'  value='$b'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
r = '$r'
g = '$g'
b = '$b'
Start = '$start'
Result = $result'
</pre>
</body>
</html>"
