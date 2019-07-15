set problem {
    # Enter problem description, exactly started
Implement regular expression matching with the
following special characters:

. (period) which matches any single character
* (asterisk) which matches zero or more of the
  preceding element

That is, implement a function that takes in a
string and a valid regular expression and returns
whether or not the string matches the regular
expression.

For example, given the regular expression "ra."
and the string "ray", your function should return
true. The same regular expression on the string
"raymond" should return false.

Given the regular expression ".*at" and the
string "chat", your function should return true.
The same regular expression on the string
"chats" should return false.

}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
    Im thinking a simple fsm in a foreach loop
    to demonstrate once through matching.

    Assume the entire string must match to be true

    COMPLICATION:
    I am unclear how the re ".*at" matches chat,
    I will add the assumption that * matches zero or
    more of the previous char, or matches the current
    character (the next different if it never matched).

    The foreach loop idea didn't work because sometimes
    the regular expression needs to advance and leave The
    character unchanged. I changed to a while loop to check
    for additional boundary errors

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


proc doesStringMatchRegexp {regex str} {
    set charList [split $str ""]
    set stringLength [string length $str]
    set regExpList [split $regex ""]
    set regLength [string length $regex]
    set regIndex 0
    set valid false
    set matchedString ""
    set precedingElement ""
    set charIndex 0
    set currentChar [lindex $charList $charIndex]
    set match true
    set maxitr 100
    set loops -1
    while {
        $match 
        && ($charIndex < $stringLength) 
        && ($regIndex < $regLength) 
        && [incr loops] < $maxitr
    } {

        set currentChar [lindex $charList $charIndex]
        set mustMatch   [lindex $regExpList $regIndex]

        rec log "ci=$charIndex re=$regIndex prevChar = '$precedingElement' currentChar = '$currentChar' mustMatch='$mustMatch'"

        switch -exact -- $mustMatch {
            "." {
                append matchedString $currentChar
                set precedingElement $currentChar
                incr regIndex
                incr charIndex
                rec log ". incr char,reg"
            }
            "*" {
                if {$currentChar eq $precedingElement} {
                    append matchedString $currentChar
                    incr charIndex
                    rec log "* incr char"
                } else {
                    # move to next re item
                    incr regIndex
                    rec log "* incr reg"
                }
            }
            default {
                if {$currentChar eq $mustMatch} {
                    append matchedString $currentChar
                    set precedingElement $currentChar
                    incr regIndex
                    incr charIndex
                    rec log "d($currentChar) incr char,reg"
                } else {
                    rec log "d($currentChar) no match"
                    set match false
                }
            }
        }
    }
    rec log "match='$match' regIndex='$regIndex', charIndex='$charIndex' matchedString='$matchedString'"
    expr {$match && $str eq $matchedString}
}

set r ra.
set s ray

set form [ns_conn form]
set r [ns_set get $form r $r]
set s [ns_set get $form s $s]

set result [doesStringMatchRegexp $r $s]

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Regular Expression Engine</title>
</head>
<body>
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='r'>Regular Expression</label>
  <input name='r' id='r'  value='$r'>
 </li>
 <li>
  <label for='s'>String to Match</label>
  <input name='s' id='s' value='$s'>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?code-2.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
r = '$r'
s = '$s'
result = '$result'
log =
[printLog log]

</pre>
</body>
</html>"
