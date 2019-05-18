set problem {
    Given an integer k and a string s, find the
    length of the longest substring that contains
    at most k distinct characters.

    For example, given s = "abcba" and k = 2, the
    longest substring with k distinct characters
    is "bcb".
}

set solution {
    The minimum length is k. It is possible that
    there is no answer to the actual question, so
    maybe return the longest (likely the current
    best at end of string).
}

proc decr {varName {amount 1}} {
    upvar $varName n
    return [incr n -$amount]
}

global log

proc longestSubstring {{str "abcba"} {k 2}} {

    global log
    set log [list]
    set index 0
    set maxlen 0 ;# max length of substring
    set curbeg 0
    set curend 0
    set curlen 0
    set uniqK  0
    set maxStr ""
    set chars("") ""
    set maxString(0) [list ""] ; # all strings of len 0 are same
    set lenMaxStr 0
    set charList [split $str ""]
    foreach char $charList {
        # keep track of number of each char
        if {[info exists chars($char)]} {
            incr chars($char) 1
            incr curend
            incr curlen
            if {$curlen > $maxlen} {
                set maxlen $curlen
                set maxbeg $curbeg
                set maxend $curend
                set maxStr [join [lrange $charList $curbeg $curend-1] ""]
            }
        } else {
            set chars($char) 1
            incr uniqK
            if {$uniqK <= $k} {
                incr curlen
                incr curend
            } else {
                # first save current string, if first longest
                if {$curlen >= $maxlen} {
                    set maxlen $curlen
                    set maxbeg $curbeg
                    set maxend $curend
                    # saving maxStr not necessary, just debug help
                    set maxStr [join [lrange $charList $curbeg $curend-1] ""]
                    # remove first char from cur string
                    set remChar [lindex $charList $curbeg]
                    if {[decr chars($remChar)] == 0} {
                        unset chars($remChar)
                        decr uniqK
                    }
                    incr curbeg
                    incr curend
                }
            }
        }
        #set tmpStr [join [lrange $charList $curbeg $curend-1] ""]
        #set tmpUnq [lsort -unique [split $tmpStr ""]]
        set tmpStr $maxStr
        set tmpUnq [lsort -unique [split $tmpStr ""]]
        lappend log [list $index $maxlen $char $tmpStr $tmpUnq]
        incr index
    }
    if {$maxlen == 0} {
        set maxStr [join [lrange $charList $curbeg $curend-1] ""]
        set maxlen [string length $maxStr]
    }
    return [list $maxlen $maxStr]
}

set str abcba
set k 2

set form [ns_conn form]
set str [ns_set get $form s $str]
set k [ns_set get $form k $k]

set result [longestSubstring $str $k]



ns_return 200 text/html "
<html>
<head>
<title>Find Longest Substring With at Most k Distinct Chars</title>
</head>
<body>
<form>
<ul>
 <li>
  <label for='s'>Target String</label>
  <input name='s' id='s'  value='$str'>
 </li>
 <li>
  <label for='k'>Max Unique Chars</label>
  <input name='k' id='k' value='$k'>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
Target String = '$str'
k = '$k'
Longest Substring  = '[lindex $result 1]'
Length of Substring = '[lindex $result 0]'
Unique Chars = '[lsort -unique [split [lindex $result 1] ""]]'

log =
[join $log \n]

</pre>
</body>
</html>"
