set problem {
    # Enter problem description, exactly started
    # Create ASCII Art Exactly as shown below,
    # Use functions/procedures and loops to simplify
    # the job
    ######### BELOW IS THE EXACT ART TO PRODUCE #####
            ||
            ||
            ||
            ||
         __/||\__
      __/:::||:::\__
   __/::::::||::::::\__
__/:::::::::||:::::::::\__
|""""""""""""""""""""""""|
\_/\/\/\/\/\/\/\/\/\/\/\_/
  \_/\/\/\/\/\/\/\/\/\_/
    \_/\/\/\/\/\/\/\_/
      \_/\/\/\/\/\_/
            ||
            ||
            ||
            ||
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         |%%||%%|
         __/||\__
      __/:::||:::\__
   __/::::::||::::::\__
__/:::::::::||:::::::::\__
|""""""""""""""""""""""""|
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
}

namespace eval ::rec {
    variable logs
    if {[array exists logs]} {
        array unset logs
    }
}

proc ::rec::log {message} {
    variable logs
    set namespace [uplevel 1 [list namespace current]]
    lappend logs($namespace) $message
}

proc ::rec::print {namespace {joinBy \n}} {
    variable logs
    join $logs($namespace) $joinBy
}

proc ::rec::reset {} {
    variable logs
    set namespace [uplevel 1 [list namespace current]]
    if {[info exists logs($namespace)]} {
        unset logs($namespace)
    } 
}

namespace eval ::spaceneedle {

    variable count
    variable line
    variable lines [list]
    variable result [list]
    variable jobs [list]
    variable procs

    # Note generic_procedure_body can be used as a lambda/apply body
    variable generic_procedure_body {
    variable result
    for {set i 0} {$i < $n} {incr i} {
        lappend result $line
        ::rec::log "[format "proc %7s" "([expr {$i + 1}]/$n)"] = $line"
    }
}

    set line(tip)  "            ||"              ;set count(tip) 4   ;lappend lines tip
    set line(a)    "         __/||\\__"          ;set count(a) 1     ;lappend lines a
    set line(b)    "      __/:::||:::\\__"       ;set count(b) 1     ;lappend lines b
    set line(c)    "   __/::::::||::::::\\__"    ;set count(c) 1     ;lappend lines c
    set line(d)    "__/:::::::::||:::::::::\\__" ;set count(d) 1     ;lappend lines d
    set line(e)    "|\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"|";set count(e) 1;lappend lines e
    set line(f)    {\_/\/\/\/\/\/\/\/\/\/\/\_/}  ;set count(f) 1     ;lappend lines f
    set line(g)    {  \_/\/\/\/\/\/\/\/\/\_/}    ;set count(g) 1     ;lappend lines g
    set line(h)    {    \_/\/\/\/\/\/\/\_/}      ;set count(h) 1     ;lappend lines h
    set line(i)    {      \_/\/\/\/\/\_/}        ;set count(i) 1     ;lappend lines i 
    set line(stem) $line(tip)                    ;set count(stem) 4  ;lappend lines stem
    set line(base) "         |%%||%%|"           ;set count(base) 16 ;lappend lines base
    set line(aa) $line(a)                        ;set count(aa) 1    ;lappend lines aa  ;#         __/||\__
    set line(bb) $line(b)                        ;set count(bb) 1    ;lappend lines bb  ;#      __/:::||:::\__
    set line(cc) $line(c)                        ;set count(cc) 1    ;lappend lines cc  ;#   __/::::::||::::::\__
    set line(dd) $line(d)                        ;set count(dd) 1    ;lappend lines dd  ;#__/:::::::::||:::::::::\__
    set line(ee) $line(e)                        ;set count(ee) 1    ;lappend lines ee  ;#|""""""""""""""""""""""""|

    foreach linetype $lines {
        set procList [list proc ::spaceneedle::$linetype [list [list n $count($linetype)] [list line $line($linetype)] ] $generic_procedure_body]
        eval $procList
        lappend procs $procList
        lappend jobs [list ::spaceneedle::$linetype $count($linetype)]
        ::rec::log $procList
    }
}

proc ::spaceneedle::main {} {

    variable jobs
    ::rec::log "jobs=$jobs"
    #This loop prints all the lines by calling procedures
    foreach job $jobs {
       {*}$job
    }
}

set b 0
set logoutput ""

set form [ns_conn form]

set b [ns_set get $form b $b]

::spaceneedle::main

if {$b} {
    set logoutput [::rec::print ::spaceneedle]
}

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>ASCII ART SEATTLE SPACENEEDLE</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='b'>Show Logs</label>
  <input type='checkbox' name='b' id='b' value='1'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?code-3.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
[join $::spaceneedle::result \n]



logs:
$logoutput
</pre>
</body>
</html>"
