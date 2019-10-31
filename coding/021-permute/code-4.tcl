set problem {
    print all permutations of string with all distinct characters
    Discuss Big O for this algo
}

set solution {
    # C like code:
    
void permutation(String str) {
    permutation(str, "")
}

void permutation (String str, String prefix) {
    if (str.length() == 0) {
        System.out.println(prefix);
    } else {
        for (int i = 0; i < str.length(); i++) {
            String rem = str.substring(0,i) + str.substring(i+1)
            permutation(rem,prefix + str.charAt(i));
        }
    }
}

}

global count 
set count 0

global results
set results [list]

global feloop
set feloop 0

global log
set log [list]

global speedup
set speedup 0

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

proc permutation {list} {

    global count feloop 
    incr count

    global speedup
    if {$speedup} {
        set su "s"
    } else {
        set su ""
    }

    set len [llength $list]
    set perms [list]

    switch -exact -- $len$su {
        1 {
            rec log "in switch 1 no speedup list='$list'"
            incr feloop ;# this counts as 1, or should it be zero?
            return $list
        }
        1s {
            rec log "in switch 1 with speedup list='$list'"
            return $list
        }
        2s {
            lassign $list a b
            incr feloop ;# this counts as 1
            return [list [list $a $b] [list $b $a]]
        }
        default {
            for {set i 0} {$i < $len} {incr i} {
                set head [lindex $list $i]
                set rest [concat [lrange $list 0 [expr {$i - 1}]] [lrange $list [expr {$i + 1}] end]]
                if {[llength $rest] == 1} {
                    #set subperms $rest 
                    lappend perms [concat $head $rest]
                    incr feloop
                } else {
                    set subperms [permutation $rest]
                    foreach subperm $subperms {
                        lappend perms [concat $head $subperm]
                        incr feloop
                    }
                }
            }
            return $perms
        }
    }
}
rec log "finished"


set s [list "aa" "bb"]

set form [ns_conn form]
set s [split [ns_set get $form s $s]]
set speedup [ns_set get $form su $speedup]
set time [time {set resultList [permutation $s]}]
set result [join $resultList "\n"]
set length [llength $resultList]
set log    [printLog log]

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Print Permutations of List '$s'</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='s'>String:</label>
  <input name='s' id='s' value='$s'>
 </li>
 <li>
  <label for='su'>SpeedUp?</label>
  <input name='su' id='su' type='checkbox' value='1' [expr {$speedup ? "checked" : ""}]>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?code-4.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
s = '$s'
number of permutations = $length == [llength $s]!
number of function calls = '$count'
number of foreach calls = '$feloop' == [llength $s]! * ([llength $s] - [expr {$speedup ? 1.5 : 1}])  ==  (n! * [expr {$speedup ? "(n - 1.5)" : "(n - 1)"}]))
Ratio = [expr {(1.0*$count)/$length}]
Time = '$time'
........................
result = 
$result
........................

log = '
$log'
</pre>
</body>
</html>"
