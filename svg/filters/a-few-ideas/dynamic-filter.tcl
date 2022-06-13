
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

proc hex2DecColor { {hexColor #000000} } {
    set len [string length $hexColor]
    set reg {(#){0,1}([a-fA-F0-9]{1,2})([a-fA-F0-9]{1,2})([a-fA-F0-9]{1,2})} \
        h(full) h(hash) h(r) h(g) h(b) h(a)
    switch -exact -- $len {
        9 {
            set fullHexColor
        }
    }
}

function toDecimal(hexNumber) {
    let hexChars = "0123456789ABCDEF",
        decimalNumber = 0,
        hexCharValue,
        exponent = 0;

    for (let i = hexNumber.length-1; i>= 0; i--) {
        hexCharValue = hexChars.indexOf(hexNumber[i]);
        decimalNumber = decimalNumber + hexCharValue * Math.pow(16, exponent++);
    }

    return decimalNumber;
}

set tableValues [list black white] ;# black=#000000FF, white=#FFFFFFFF
set opacity 1.0
set dur 30
set start 0
set repeatCount "indefinite"

set form [ns_conn form]
set testVal [ns_set get $form tv "#000000"]
ns_log Notice "testVal='$testVal convert to dec: [toDecimal [string range $testVal 1 2]]"
set tableValues [ns_set get $form t $tableValues]
set repeatCount [ns_set get $form r $repeatCount]
set start [ns_set get $form s $start]
set dur [ns_set get $form d $dur]
set opacity [ns_set get $form o $opacity]

set result [::wtk::ttt::applyTemplateNS svg-filter]
set content [lindex $result end]
ns_return 200 "image/svg+xml" $content 
