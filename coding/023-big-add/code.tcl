set problem {
    # Enter problem description, exactly started
    print all integer solutions to a^3 + b^3 = c^3 + d^3
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
    assume solution only if a and b are not equal
    solutions of the form a^3 + b^3 = b^3 + a^3 are not 
    interesting. a != b != c != d


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

global resHash
global sums
global cubes
global loopCount
global createCount
global cubesCreate

proc findMatch {n max} {
    global sums
    global resHash
    global cubes
    global loopCount 
    global createCount
    global cubesCreate
    set loopCount 0;
    set createCount 0
    set cubesCreate 0
    set result [list]
    set len -2
    set resHash(0,0) [list 0 {0 0 0 0}]
    for {set i 1} {$i <= $n && ($len <= $max)} {incr i} {
        for {set j 1} {$j <= $n} {incr j} {
            if {$i == $j} {
                continue
            }
            if {[info exists resHash($j,$i)] ||
                [info exists resHash($j,$i)]
            } {
                continue
            }
            incr loopCount
            if {![info exists cubes($j)]} {
                set cubes($j) [expr {$j*$j*$j}]
                incr cubesCreate
            }
            if {![info exists cubes($i)]} {
                set cubes($i) [expr {$i*$i*$i}]
                incr cubesCreate
            }
            set sum [expr {$cubes($i) + $cubes($j)}]
            set resHash($i,$j) [list $sum [list $i $j]]
            lappend sums($sum) [list $i $j]
            incr createCount
            incr len 1
        }
    }
    return $result
}

set n 12

set form [ns_conn form]
set n [ns_set get $form n $n]

if {$n > 1000} {
    set n 1000
}
set max [expr {$n * $n}]

set result [findMatch $n $max]

set sumlist "<ol>\n"
set ta 1
foreach sum [lsort -integer -increasing [array names sums]] {
    set len [llength $sums($sum)]
    if { $len > 1} {
        if {$len > $ta} {
            set tanum " = <b>Ta($len)</b>"
            incr ta
        } else {
            set tanum ""
        }
        append sumlist "<li>$sum = $sums($sum)$tanum</li>\n"
    }
}
append sumlist "</ol>"

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>All Solutions to a*a*a + b*b*b = c*c*c + d*d*d</title>
<style>
body {
    font-family: Arial;
}
td.g {
    background-color: green;
}
#background {
    width: 700px;
}
blockquote {
    margin-right: 20px;
    margin-left: 20px;
}
blockquote::before, 
blockquote::after {
    font-weight: bold;
    font-size: 1.5em;
}
ul {
    margin-block-start: 5px;
    margin-block-end: 5px;
    list-style-type: none;
    padding-left: 5px;
    padding-top: 10px;
}
li {
    padding-left: 5px;
}

</style>
</head>
<body>
<div id='background'>
<h2>All solutions to a<sup>3</sup> + b<sup>3</sup> = c<sup>3</sup> + d<sup>3</sup>, a &ne; b &ne; c &ne; d</h2>
<p>Does this look like an uninteresting computer science problem? Here is a one paragraph background of
the interest in this simple mathematics:
<blockquote>

<p>The number 1729 is known as the Hardy–Ramanujan number after a famous visit by
 Hardy to see Ramanujan at a hospital. In Hardy's words:</p>

<blockquote>I remember once going to see him when he was ill at Putney. I had ridden in
 taxi cab number 1729 and remarked that the number seemed to me rather a dull one,
  and that I hoped it was not an unfavorable omen. \"No\", he replied, \"it is a very 
  interesting number; it is the smallest number expressible as the sum of two
   cubes in two different ways.</blockquote>

<p>Immediately before this anecdote, Hardy quoted Littlewood as saying, 
<q>Every positive integer was one of Ramanujan's personal friends.</q>

<p>The two different ways are:

<p>1729 = a1<sup>3</sup> + 12<sup>3</sup> = 9c<sup>3</sup> + 10<sup>3</sup>
<p>Generalizations of this idea have created the notion of 
<a href='https://en.wikipedia.org/wiki/Taxicab_number'>taxicab numbers</a>.
<p>The <b>Ta(n)</b> number for <b>n=2,3...</b> is the <b>smallest integer</b> which is the sum of
two cubed integers in n different ways. This requires that <b>a<sub>i</sub>, b<sub>i</sub></b>
are all different.</p>
</blockquote> 
<a href='The Fifth Taxicab Number is 48988659276962496.html'>The Fifth Taxicab Number is 48988659276962496</a><br/>
<a href='Enumerating Solutions to p(a) + q(b) = r(c) + s(d).pdf'>Enumerating Solutions to p(a) + q(b) = r(c) + s(d)</a><br/>
<a href='soretedsums.html'>sortedsums.html</a><br/>
<p>The code here was written prior to finding the above resources and I haven't yet looked at how it compares, but
Dan Bernstein is famous for finding efficient solutions where just the order O(n) is not good enough, cutting
time or space in half can have significant benefits. </p>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
</div>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>Calculate and list solutions for N &leq; 1000:
 <li>
  <label for='n'>N</label>
  <input name='n' id='n' value='$n'>
 </li><!--
 <li>
  <label for='max'>Max Solutions</label>
  <input name='max' id='max' value='$max'>
 </li>-->
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>

<pre>
n = '$n'
max = '$max'
loopCount ='$loopCount' (O(N) = N<sup>2</sup>)
createCount='$createCount' (Number of cubes created)
</pre>
<h3>Sums List</h3>
$sumlist
</body>
</html>"
