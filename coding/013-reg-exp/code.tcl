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

FROM LEETCODE:

10. Regular Expression Matching
Hard

2932

556

Favorite

Share
Given an input string (s) and a pattern (p), implement regular expression matching with support for '.' and '*'.

'.' Matches any single character.
'*' Matches zero or more of the preceding element.
The matching should cover the entire input string (not partial).

Note:

s could be empty and contains only lowercase letters a-z.
p could be empty and contains only lowercase letters a-z, and characters like . or *.
Example 1:

Input:
s = "aa"
p = "a"
Output: false
Explanation: "a" does not match the entire string "aa".
Example 2:

Input:
s = "aa"
p = "a*"
Output: true
Explanation: '*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".
Example 3:

Input:
s = "ab"
p = ".*"
Output: true
Explanation: ".*" means "zero or more (*) of any character (.)".
Example 4:

Input:
s = "aab"
p = "c*a*b"
Output: true
Explanation: c can be repeated 0 times, a can be repeated 1 time. Therefore, it matches "aab".
Example 5:

Input:
s = "mississippi"
p = "mis*is*p*."
Output: false

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
    set regExpList [split $regex ""]
    set regIndex 0
    set valid false
    set mustMatch [lindex $regExpList $regIndex]
    set matchedString ""
    set precedingElement ""

    foreach char $charList {
        rec log "char = '$char' mustMatch='$mustMatch'"
        switch -exact -- $mustMatch {
            "." {
                append matchedString $char
                incr regIndex
                set precedingElement $char
            }
            "*" {
                if {$char eq $precedingElement} {
                    append matchedString $char
                } else {
                    incr regIndex
                    set preceedingElement $char
                }
            }
            default {
                if {$char eq $mustMatch} {
                    append matchedString $char
                    set preceedingElement $char
                    incr regIndex
                } else {
                    break;
                }
            }
        }
        set mustMatch [lindex $regExpList $regIndex]
    }
    expr {$str eq $matchedString}
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
<a href='source.tcl'>Source Code</a><br>
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
