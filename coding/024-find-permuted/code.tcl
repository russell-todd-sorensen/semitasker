set problem {
    Find permuted string in larger text
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
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

proc findAllPerms {Str Txt} {
    # pre-process Str
    set results [list]
    foreach letter [split $Str ""] {
        if {[info exists Hash($letter)]} {
            incr Hash($letter)
        } else {
            set Hash($letter) 1
        }
    }
    set len [string length $Txt]
    set Text [split $Txt ""]
    set t 0
    set sLen [string length $Str]
    set maxStart [expr {$len - $sLen}]
    set bigO 0
    while {$t <= $maxStart && $t < 100} {
        array set h [array get Hash] 
        for {set i $t} {$i < $t + $sLen} {incr i} {
            incr bigO
            set letter [lindex $Text $i]
            rec log "i=$i t=$t letter=$letter h=[array get h]"
            if {[info exists h($letter)]} {
                incr h($letter) -1
                if {$h($letter) == 0} {
                    unset h($letter)
                }
            } elseif {[info exists H($letter)]} {
                incr t
                break;
            } else { ;# this means the letter isn't in Str
                set t $i
                incr t
                break;
            }
        }
        ns_log Notice "t=$t i=$i h=[array get h]"
        if {[llength [array get h]] > 0} {
            rec log "Notice at t=$t and i=$i and h=[array get h] results=$results"
            continue
        }
        rec log "success i=$i t=$t h=[array get h] item=[list $t [expr {$i - 1}]] maxStart=$maxStart"
        lappend results [list $t [expr {$i - 1}]]
        incr t
    }
    rec log "bigO=$bigO compare calc=[expr {($len-$sLen+1) * $sLen}] = O((n-s+1)*s)"
    return $results
}

set text "abcdabcabcdefabcefgefgabcdfgacdefgaeabaradd" 
set str "abc"

set form [ns_conn form]
set text [ns_set get $form t $text]
set str [ns_set get $form s $str]

set result [findAllPerms $str $text]

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
  <label for='t'>Text to Search</label>
  <textarea name='t' id='t'  >$text</textarea>
 </li>
 <li>
  <label for='s'>String to Find</label>
  <input name='s' id='s' value='$str'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
text = '$text'
str = '$str'
result = '$result'
log = '[printLog log]'
</pre>
</body>
</html>"
