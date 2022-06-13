# test encodings
set request [ns_conn request]
set query [ns_conn query]

if {[llength [info proc deleteInterp]] == 0} {
    proc deleteInterp {alias} {
        if {[interp exists $alias]} {
            interp delete $alias
        }
    }
}

deleteInterp recurse

set myInterp [interp create recurse]
ns_atclose deleteInterp $myInterp

interp eval $myInterp {

    global log 
    global recursions 0
    set log [list]
    set logName log
    set maxLevel 0

    proc rec {logName what} {
        global $logName
        lappend $logName $what
    }

    proc init {} {
        global log
        set log [list]
    }

    proc printLog {logName {joinBy \n} {reset 0}} {
        global $logName
        set result [join [set $logName] $joinBy]
        if {$reset} {
            set $logName [list]
        }
        return $result
    }
}

global log 
global recursions 0
set log [list]
set logName log
set maxLevel 0

proc rec {logName what} {
    global $logName
    lappend $logName $what
}

proc init {} {
    global log
    set log [list]
}

proc printLog {logName {joinBy \n} {reset 0}} {
    global $logName
    set result [join [set $logName] $joinBy]
    if {$reset} {
        set $logName [list]
    }
    return $result
}

array set tChecked {command "" proc "" namespace ""}
set code "set x 5"
set type "command"

set form [ns_conn form]
set code [ns_set get $form c $code]
set type [ns_set get $form t $type]

proc checkOption {arr checked {multiple false}} {
    upvar $arr A 
    global log
    foreach option [lsort [array names A]] {
        set A($option) "not-checked"
        rec log "set A($option) to 'not-checked'"
    }
    if {$multiple} {
        foreach option $checked {
            set A($option) "checked"
            rec log "set A($option) to 'checked' ($A($option))"
        }
    } else {
        set A($checked) "checked"
        rec log "set A($checked) to 'checked' ($A($checked))"
    }
    rec log "tChecked = [array get A]"
}

set recursionLimit 1000

try {

    set result "request='$request'<br>query='$query'"
    checkOption tChecked $type 
    set radioHtml ""
    rec log "...tChecked = [array get tChecked]"
    
    foreach option [lsort [array names tChecked]] {
        append radioHtml "<li>
    <label for='type-$option'>$option 
    <input type='radio' name='t' id='type-$option' value='$option' $tChecked($option)></li>
"
        rec log "....tChecked($option) = $tChecked($option)"
    }

    ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Format Tcl Code using Rmadilo</title>
</head>
<body>
<!-- method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li><span>Type
  <ul>
  $radioHtml
  </ul>
 </li>
 <li>
  <label for='c'>Code:</label>
  <textarea name='c' id='c' width='300' rows='10'>$code</textarea>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>

<pre>
type = '$type'
result = 
--v
$result
--^
code = $code
log = [printLog log]
</pre>
</body>
</html>"
} on error {errorTrace optionList} {
    global errorInfo
    set errorText [ns_adp_parse -file [ns_url2file /services/return-code/500/internal-server-error.adp]]
    ns_return 500 "text/html; charset=utf-8"  $errorText
}