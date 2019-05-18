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
global chars

proc longestSubstring {{str "abcba"} {k 2}} {

    global log
    global chars
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
            if {$curlen >= $maxlen} {
                set maxlen $curlen
                set maxbeg $curbeg
                set maxend $curend
                set maxStr [join [lrange $charList $curbeg [expr $curend - 1]] ""]
            }
        } else {
            set chars($char) 1
            incr uniqK
            if {$uniqK <= $k} {
                incr curlen
                incr curend
                if {$curlen >= $maxlen} {
                    set maxlen $curlen
                    set maxbeg $curbeg
                    set maxend $curend
                    set maxStr [join [lrange $charList $curbeg $curend] ""]
                }

                lappend maxString($uniqK) [join [lrange $charList $curbeg $curend-1] ""]
            } else {
                # first save current string, if first longest
                if {$curlen >= $maxlen} {
                    set maxlen $curlen
                    set maxbeg $curbeg
                    set maxend $curend
                    # saving maxStr not necessary, just debug help
                    set maxStr [join [lrange $charList $curbeg [expr $curend - 1]] ""]
                    ns_log Notice "curlen >= maxlen maxStr='$maxStr'"
                    # remove first char from cur string
                    set remChar [lindex $charList $curbeg]
                    if {[decr chars($remChar)] == 0} {
                        unset chars($remChar)
                        decr uniqK
                    } else {
                        set rewind 0
                        while {[set tmpChar [lindex $charList [expr $index - $rewind]]] ne $remChar} {
                            incr rewind
                            ns_log Notice "rewind = $rewind, str start='[expr $index - $rewind]' remChar =$remChar"
                        }
                        set remList [lrange $charList [expr $curbeg + 1] [expr $index - $rewind]]
                        ns_log Notice "remList='$remList'"
                        foreach tmpChar $remList {
                            ns_log Notice "decreasing $tmpChar"
                            if {[decr chars($tmpChar)] == 0 } {
                                unset chars($tmpChar)
                                decr uniqK
                                ns_log Notice "decreasing uniqK to $uniqK unset $tmpChar"
                            }
                        }
                        set curbeg [expr {$curend - $rewind}]
                        decr curlen $rewind
                    }
                    incr curbeg
                    incr curend
                } else {
                    ns_log Notice "In unused branch index = '$index', maxStr='$maxStr' curlen='$curlen' maxlen='$maxlen'"
                }

            }

        }
            if {$uniqK > $k} {
                lappend log "woops uniqK = '$uniqK'"
                set tmpStr [join [lrange $charList [decr $curbeg] [decr $curend 2]] ""]
                set tmpUnq [lsort -unique [split $tmpStr ""]]
                lappend log [list $index $maxlen $char $tmpStr $tmpUnq]
            }
        #set tmpStr [join [lrange $charList $curbeg $curend-1] ""]
        #set tmpUnq [lsort -unique [split $tmpStr ""]]
        #lappend log [list $index $maxlen $char $tmpStr $tmpUnq]
        set curStr [join [lrange $charList $curbeg [expr $curend - 1]] ""]
        set curlen [string length $curStr]
        if {$curlen == $maxlen} {
            set maxStr $curStr
        }
        ns_log Notice "curlen=>'$curlen' maxStr=>'$maxStr' curStr=>'$curStr'"
        incr index
    }
    decr index
    decr curbeg
    decr curend
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
set longestSubstring [lindex $result 1]
set lengthLongest    [lindex $result 0]
set uniqueChars      [lsort -unique [split $longestSubstring ""]]
set stats [list]
set origUniqueChars [lsort -unique [split $str ""]]
foreach ch $origUniqueChars {
    if {[info exists chars($ch)]} {
        lappend stats [list $ch $chars($ch)]
    } else {
        lappend stats [list $ch 0]
    }
}
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
Longest Substring  = '$longestSubstring'
Length of Substring = '$lengthLongest'
Unique Chars = '$uniqueChars'

log =
[join $log \n]

stats =
[join $stats \n]
</pre>
</body>
</html>"
