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

proc permutation {str} {

    set len [string length $str]
    global count
    incr count
    if {$count > 200000} {
        rec log "Count over 2000, str = '$str', prefix='$prefix'"
        return 
    }
    set perms [list]
    switch -exact -- $len {
        1 {
            return $str
        }
        2 {
            lassign [split $str ""] a b
            return [list $a$b $b$a]
        }
        default {
            for {set i 0} {$i < $len} {incr i} {
                set head [string index $str $i]
                set rest [string range $str 0 [expr {$i - 1}]][string range $str [expr {$i + 1}] end]
                set subperms [permutation $rest]
                foreach subperm $subperms {
                    lappend perms $head$subperm
                }
            }
            return $perms
        }
    }
}

set s ab

set form [ns_conn form]
set s [ns_set get $form s $s]

set result [join [permutation $s] "\n"]
set length [llength $result]
set log    [printLog log]

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Print Permutations of '$s' Maybe More Efficient?</title>
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
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?code-3.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
s = '$s'
number of permutations = $length
number of function calls = '$count'
Ratio = [expr {(1.0*$count)/$length}]
........................
result = 
$result
........................

log = '
$log'
</pre>
</body>
</html>"
