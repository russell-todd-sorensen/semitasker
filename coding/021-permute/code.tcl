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

proc permutation {str {prefix ""}} {
    #rec log "str = '$str', prefix='$prefix'"
    set len [string length $str]
    global count
    incr count
    #if {$count > 200000} {
    #    rec log "Count over 2000, str = '$str', prefix='$prefix'"
    #    return 
    #}
    if {$len == 0} {
        rec results $prefix
    } else {
        for {set i 0} {$i<$len} {incr i} {
            set rem "[string range $str 0 [expr {$i - 1}]][string range $str [expr {$i + 1}] end]"
            rec log "rem = '$rem' prefix='$prefix[string range $str $i $i]'"
            permutation $rem "$prefix[string range $str $i $i]"
        }
    }
}

set s ab

set form [ns_conn form]
set s [ns_set get $form s $s]

set time [time {permutation $s}]

set result [printLog results]
set length [llength $results]
set log    [printLog log]

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Print Permutations of '$s'</title>
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
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
s = '$s'
number of times called = $length
Count = '$count'
Ratio = [expr {(1.0*$count)/$length}]
Time  = '$time'
........................
result = 
$result
........................

log = '
$log'
</pre>
</body>
</html>"
