set problem {
    # More useful logging controls with per-namespace config
    # When monitoring new or problematic code, turning on debugging
    # works globally.
}

set solution {
    # New debugging configuration to allow logging to be controlled
    # not just per namespace, but also just per proc execution:
    # turn on logging, call proc which will log info, turn off when
    # proc returns.
}

ns_log Notice "nvBitMap = '$LogLevels'"

if {[namespace exists ::nvtest]} {
    namespace delete ::nvtest
}

if {[namespace exists ::logn]} {
    namespace delete ::logn
}

proc ::wtk::nv::BitValue {bitMapVar} {
    upvar 1 $bitMapVar NV
    set len [llength $NV]
    set value 0
    for {set i 0} {$i<$len} {incr i} {
        incr value [nvValue NV $i]
    }
    return $value
}

namespace eval ::logd {
    variable logs
    variable levels
    variable ns
    # create nvList 
    ::wtk::nv::nvBitMap levels "" Notice Warning Debug Special Error
    array set logs log [list]
    proc logLevels {namespace args} {

    }
    proc rec {name level args} {
        variable logs
        lappend logs($name) $what
    }
    proc print {name {joinBy \n} {reset 0}} {
        variable logs
        if {[info exists log($name)]} {
            set result [join $log($name) $joinBy]
        } else {
            set logs($name) [list]
            set result ""
        }
        if {$reset} {
            set log($name) [list]
        }
        return $result
    }
    proc length {name} {
        variable logs
        if {[info exists logs($name)]} {
            return [llength $logs($name)]
        } else {
            return -1
        }
    }
    namespace export *

}


proc createAndUseBitmapAPI {args} {
    return "todo"
}

set a todo
set b todo

set form [ns_conn form]
set a [ns_set get $form a $a]
set b [ns_set get $form b $b]

set result [createAndUseBitmapAPI $a $b]

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
  <label for='b'>Input List</label>
  <input name='b' id='b'  value='$b'>
 </li>
 <li>
  <label for='a'>Target (k)</label>
  <input name='a' id='a' value='$a'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
a = '$a'
b = '$b'
</pre>
</body>
</html>"
