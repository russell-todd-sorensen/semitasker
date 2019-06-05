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
}

proc doesStringMatchRegexp {regex str} {
    set charList [split $str ""]
    set regExpList [split $regex]
    set regIndex 0
    set valid false
    set mustMatch [lindex $regExpList $regIndex]
    set matchedString ""
    set precedingElement ""

    # divide the regular expression into sections
    set regexpSections [list]
    foreach char $regExpList {


    }

    foreach char $charList {
        switch --exact -- $mustMatch {
            "." {
                append matchedString $char
                incr regIndex
                set precedingElement $char
            }
            "*" {
                if {$char eq $precedingElement} {
                    append matchedString $char
                } else {

                }
            }
            default {

            }
        }
        set mustMatch [lindex $regExpList $regIndex]
    }



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
</pre>
</body>
</html>"
