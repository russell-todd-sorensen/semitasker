set problem {
    Implement a job scheduler which takes in
    a function "f" and an integer "n", and
    calls "f"after "n" milliseconds.
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
}

set functions [list \
    [list string repeat . 5] \
    [list string trim "abcdedab" "ab" ] \
    [list join "abc def ghi jkl" "-"]  \
    "clock format \[clock seconds\]" \
]

set functionId [list]
set delay 1000
set gap 2000

set timeline 0

set form [ns_conn form]

for {set i 0} {$i < [ns_set size $form]} {incr i} {
    set value [ns_set value $form $i]
    set key [ns_set key $form $i]
    switch -nocase -- $key {
        "f" {
            lappend functionId $value
        }
        "n" {
            set delay $value
        }
        "g" {
            set gap $value
        }
        default {
            ns_log Notice "form with key=$key and value='$value' not used"
        }
    }
}

global ::fid
set ::fid 0

proc scheduleFunction {functionList delayMs} {
    global ::fid
    set string1 "after $delayMs executing \[$functionList\] = "
    set body "
        ns_write \$string1
        set result \[$functionList\]
        ns_write \"\$result\n\"
    "
    proc func$fid {string1} $body
    ns_log Notice "func$::fid body = '[info body func$::fid]'"
    set id [after $delayMs [list func$::fid $string1]]
    incr ::fid
    return $id
}

global ::schedule
set ::schedule [list]
incr timeline $delay

foreach funId $functionId {
    set function [lindex $functions $funId]
    lappend ::schedule [list $funId $function ${timeline}ms [scheduleFunction $function $timeline]]
    incr timeline $gap
}

proc ::bgerror { message } {
    ns_log Error "Background Error: '$message'"
}

#incr timeline 1000
#after $timeline [list set ::finished 5]

ns_headers 200 text/html
ns_log Notice success=[ns_write "
<html>
<head>
<title>Schedule Function To Run After Some ms Delay</title>
</head>
<body>
<form>
<ul>
 <li>
  <label for='f'>Function ID</label>
  <select name='f' id='f' multiple='true' >"]
set i 0
foreach funcList $functions {
    append output "  <option value='$i'>$funcList</option>\n"
    incr i
}
append output "</select>
 </li>
 <li>
  <label for='n'>Delay in ms</label>
  <input name='n' id='n' value='$delay'>
 </li>
 <li>
 <label for='g'>Gap in ms</label>
  <input name='g' id='g' value='$gap'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<h4>Scheduled Functions</h4>
<pre>\n"

ns_write $output

set ::scheduleList [list]
set formatString %5s%10s%10s%-50s
set headerRow [format $formatString Id MilliSec AfterId "     Function"]

foreach sched $schedule {
    lassign $sched funid fun ms aid
    lappend ::scheduleList [format $formatString $funid $ms $aid "    \[$fun\]" ]
}

ns_write "[join $::scheduleList \n]</pre><pre>"

incr timeline 1000
after $timeline ns_write "</pre></body></html>"
incr timeline 100
after $timeline "set ::finished done"
vwait ::finished
