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

global log
global result
set log [list]

proc rec {logName what} {
    global $logName
    lappend $logName $what
}

proc printLog {logName {joinBy \n} {reset 0}} {
    global $logName
    set res [join [set $logName] $joinBy]
    if {$reset} {
        set $logName [list]
    }
    return $res
}

proc main {} {
    global result
    set art ""
    set lines [list]

    set tip "            ||" ;set count(tip) 4;lappend lines tip

    set a "         __/||\\__";set count(a) 1;lappend lines a
    set b "      __/:::||:::\\__";set count(b) 1;lappend lines b
    set c "   __/::::::||::::::\\__";set count(c) 1;lappend lines c
    set d "__/:::::::::||:::::::::\\__";set count(d) 1;lappend lines d
    set e "|\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"|";set count(e) 1;lappend lines e
    set f {\_/\/\/\/\/\/\/\/\/\/\/\_/};set count(f) 1;lappend lines f
    set g {  \_/\/\/\/\/\/\/\/\/\_/};set count(g) 1;lappend lines g
    set h {    \_/\/\/\/\/\/\/\_/};set count(h) 1;lappend lines h
    set ii {      \_/\/\/\/\/\_/};set count(ii) 1;lappend lines ii ;# i is a loop variable, oops
    set stem $tip;set count(stem) 4;lappend lines stem
    set base "         |%%||%%|";set count(base) 16;lappend lines base
    set aa $a;set count(aa) 1;lappend lines aa  ;#         __/||\__
    set bb $b;set count(bb) 1;lappend lines bb  ;#      __/:::||:::\__
    set cc $c;set count(cc) 1;lappend lines cc  ;#   __/::::::||::::::\__
    set dd $d;set count(dd) 1;lappend lines dd  ;#__/:::::::::||:::::::::\__
    set ee $e;set count(ee) 1;lappend lines ee  ;#|""""""""""""""""""""""""|

    set generic_procedure_body {
    global result
    for {set i 0} {$i < $n} {incr i} {
        lappend result $line
        rec log "[format "proc %7s" "([expr {$i + 1}]/$n)"] = $line"
    }
   
}

    foreach linetype $lines {
        set procList [list proc $linetype [list [list n $count($linetype)] [list line [set $linetype]]] $generic_procedure_body]
        eval $procList
        lappend procs $procList
        rec log $procList
    }

    #This loop prints all the lines by calling procedures
    foreach lineName $lines {
        $lineName
    }
}

set b 0
set logoutput ""

set form [ns_conn form]

set b [ns_set get $form b $b]

main

if {$b} {
    set logoutput [join $log \n]
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
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
[join $result \n]



logs:
$logoutput
</pre>
</body>
</html>"
