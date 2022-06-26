set problem {
    Find permuted string in larger text
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
}

global log
global max
set log [list]

proc rec {logName what} {
    global $logName
    global max
    incr max
    lappend $logName $what
    if {$max > 1000} {
        ns_log [printLog $logName]
        return -code error "Max Recordings"
    }
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

    while {$t <= $maxStart && $t < 10000} {
        set begin $t
        set cLen 0
        array set h [array get Hash]
        set ok true
        while {$ok} {
            set letter [lindex $Text $t]
            rec log "PROCESS letter=$letter t=$t h=[array get h]"
            if {![info exists h($letter)]} {
                # this clears the platter
                incr t 
                set ok false
                rec log "Flush and start over at t=$t letter=$letter"
                break
            } elseif {$h($letter) > 0} {
                incr h($letter) -1
                incr cLen
                rec log "Added $letter"
                if {$cLen == $sLen} {
                    lappend results [list $begin $t]
                    rec log "Added MATCH [list $begin $t]"
                    incr h([lindex $Text $begin]) 1
                    incr cLen -1
                    incr begin
                }
                incr t
            } else {
                while {[set prev [lindex $Text $begin]] != $letter} {
                    incr h($prev) 1
                    incr begin
                    incr cLen -1
                    rec log "Reducing $prev from [lrange $Text $begin [expr {$t -1}]] now [lrange $Text [expr {$begin + 1}] [expr {$t -1}]]"
                }
                incr h($letter)
                incr begin
                incr cLen -1
                rec log "Forward to begin=$begin cLen = $cLen"
            }
        }
    }

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
<a href='source.tcl?2'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
text = '$text'
str = '$str'
result = '$result'
log = '>>>[printLog log]<<<'
</pre>
</body>
</html>"
