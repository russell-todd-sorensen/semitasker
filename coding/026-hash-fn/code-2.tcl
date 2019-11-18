set problem {
    # Enter problem description, exactly started
    Examine hash function used in Tcl for various
    properties.
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

#    for (c=*string++ ; c ; c=*string++) {
#        result += (result<<3) + c;
#     }
#     return result;
#
global hashFn

proc randomUnicodeChar {{count 1} {maxCodePoint 16000} {strLen 1}} {
    set codePoints [list]
    if {$count > $maxCodePoint && $strLen == 1} {
        for {set i 0} {$i < $count} {incr i} {
            lappend codePoints [format %c [expr {$i % $maxCodePoint}]]
         }
        return $codePoints
    }
    for {set i 0} {$i < $count} {incr i} {
        set uchar [list]
        for {set j 0} {$j < $strLen} {incr j} {
            lappend uchar [expr {int(round(rand()*$maxCodePoint))}]
        }
        if {[info exists chars($uchar)]} {
            incr i -1 
            continue
        } else {
            set chars($uchar) 1
        }
        set str ""
        foreach char $uchar {
            append str [format %c $char] 
        }
        lappend codePoints $str
    }
    return $codePoints
}

proc tclHash {str base} {

    set hash 0
    foreach char [split $str ""] {
        set hash [expr { (($hash<<3) + [scan $char %c])%(1<<$base)}]
        ns_log Notice "hash for $str now $hash"
    }
    return $hash
}

proc tclHashDJB2 {str base} {

    set hash 5381
    foreach char [split $str ""] {
        set hash [expr { ((($hash<<5) + $hash ) + [scan $char %c])%(1<<$base)}]
        ns_log Notice "hash for $str now $hash"
    }
    return $hash
}

set hashFn(0) tclHash 
set hashFn(1) tclHashDJB2

proc tclHashs {keys {fid 0} {base 32} {size 100}} {
    global hashFn
    foreach key $keys {
        set hash [$hashFn($fid) $key $base]
        lappend hashs $hash
        lappend result [expr {$hash % $size}]
    }
    return [list $hashs $result]
}

set keys [list aa bb c d e f g]
set fid 0
set base 32
set size 100
set rand 0
set maxc 16000
set slen 1

set form [ns_conn form]
set keys [ns_set get $form k $keys]
set fid  [ns_set get $form fid $fid]
set base [ns_set get $form b $base]
set size [ns_set get $form s $size]
set rand [ns_set get $form r $rand]
set maxc [ns_set get $form m $maxc]
set slen [ns_set get $form l $slen]

if {$rand > 0} {
    set keys [randomUnicodeChar $rand $maxc $slen]
}

set hashsResultsList [tclHashs $keys $fid $base $size]
set hashs [lindex $hashsResultsList 0]
set buckets [lindex $hashsResultsList 1]

for {set i 0} {$i < $size} {incr i} {
    set bucket($i) 0
}

set blen [llength $buckets]

foreach b $buckets {
    incr bucket($b)
}

set tabWidth [expr {(int(pow($size,0.5)/10.0))*10}]

set bucketTab "<table id='bt' cellspacing='0' cellpadding='3' border='1'>
 <tr><th>num</th>\n"
for {set i 0} {$i < $tabWidth} {incr i} {

    append bucketTab "<th>$i</th>"
}

set distro(0) 0

for {set i 0} {$i < $size} {incr i} {
    if {$i % $tabWidth == 0} {
        append bucketTab "\n</tr>\n<tr><th>$i</th>"
    }
    if {$bucket($i) > 0} {
        set class " class='r'"
    } else {
        set class ""
    }

    incr distro($bucket($i));

    append bucketTab "<td$class>$bucket($i)</td>"
}
append bucketTab "\n</tr>\n</table>"


set options "<table cellspacing='0' cellpadding='5' border='1'>
<tr><th>Select</th><th>Hash Body</th></tr>\n"
foreach fnId [lsort -integer -increasing [array names hashFn]] {
    if {$fnId == $fid} {
        set checked " checked"
    } else {
        set checked ""
    }
    append options "<tr><td><input name='fid' id='fid' type='radio' value='$fnId'$checked></td>
    <td ><pre>$hashFn($fnId) : \n[info body $hashFn($fnId)]</pre></td></tr>\n"
} 
append options "\n</table>"

set distroTable "<table cellspacing='0' cellpadding='5' border='1'>
<tr><th>Count</th><th>Cells With</th></tr>\n"
foreach ct [lsort -integer -increasing [array names distro]] {
    append distroTable "<tr><td>$ct</td><td>$distro($ct)</td></tr>\n"
}
append distroTable "</table>\n"
ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Hash Function Demonstration and Evaluation</title>
<style>
.r {
    color: darkred;
    font-weight: bold;
}
</style>
</head>
<body>
<!-- -->
<form autocomplete='off' method='POST' encoding='multi-part/formdata'  spellcheck='false'>
<ul>
 <li>
  <label for='fid'>Hash Function</label>
  $options
 </li>
 <li>
  <label for='k'>Input Keys List</label>
  <textarea name='k' id='k' cols='100' >$keys</textarea>
 </li>
 <li><label for='r'>Random Strings</label>
  <input name='r' id='r' value='$rand' type='number' min='0' max='1000000' />
  <label for='m'>Max Unicode Char</label>
  <input name='m' id='m' value='$maxc' type='number' min='1' max='16000' />
  <lable for='l'>String Length</label>
  <input type='number' min='1' max='200' id='l' name='l' value='$slen' />
  </li>
 <li>
  <label for='b'>Base </label>
  <input name='b' id='b' type='numeric' min='2' max='32' value='$base'>
 <li>
 <li>
  <label for='s'>Table Size </label>
  <input name='s' id='s' type='numeric' min='2' max='1000' value='$size'>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?2'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
hashs = '$hashs'
</pre>
$distroTable
$bucketTab
</body>
</html>"
