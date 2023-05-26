set problem {
    #demonstrate usage of tcl interp for safe computing
}

set solution {
    # Mostly interested in using interp to change the recursion limit
    # for massively recursive procedures.
    # The current built in limit is 1000.
}

if {[llength [info proc deleteInterp]] == 0} {
    proc deleteInterp {alias} {
        if {[interp exists $alias]} {
            interp delete $alias
        }
    }
}

deleteInterp recurse
set m 1000
set myInterp [interp create recurse]
ns_atclose deleteInterp $myInterp

interp eval $myInterp {

    namespace eval ::log {
        variable journal
        variable domains [list]

        if {[array exists journal]} {
            array unset journal
        }

        proc new {name {lineFmt "%5.5d"} } {
            variable journal
            variable domains
            if {[info exists journal(name)]} {
                return $name
            } else {
                lappend domains $name
                set journal(${name}:fmt) $lineFmt
                set journal(${name}:count) 0
                rec $name "added new log named '$name'"
            }
        }
        proc rec {name what} {
            variable journal
            set fmt $journal(${name}:fmt)
            set journal(${name}:[format $fmt [incr journal(${name}:count)]]) $what
            puts "$name:[format $fmt $journal(${name}:count)] $what"
        }

        proc initJournal {} {
            variable journal
        }

        proc print {name {keyGlob *} {joinBy \n} {reset 0}} {
            variable journal
            set lines [lsort -stride 2 [array get journal ${name}:$keyGlob]]
            set result [join $lines $joinBy]
            if {$reset} {
                set fmt $journal(${name}:fmt)
                array unset journal ${name}:$keyGlob
                set journal(${name}:fmt) $fmt
                set journal(${name}:count) 0
            }
            return $result
        }
        namespace export *
    }
    namespace eval ::lightswitch {
        variable switchCount 1
        variable stateList [list]
        variable onOffStatus "1"
        variable initialized 0
        namespace import -force ::log::*
        initJournal
        new log
        #Toggle switches at increased spacing [1,2,...n]
        proc init {n s} {
            variable initialized
            if {! $initialized} {
                variable switchCount $n
                variable startString $s
                variable stateList [list $s]
            }
        }
        proc toggle {stride {s ""}} {
            variable switchCount
            variable stateList
            if {$s ne ""} {
                lappend stateList $s
            }
            set cur [lindex $stateList end]
            set len [string length $cur]
            set result ""
            rec log "cur=$cur"
            for {set i 0} {$i<$len} {incr i} {
                set char [string index $cur $i]
                rec log "i=$i,char=$char,len=$len,stride=$stride"
                if {($i+1)%$stride==0} {
                    rec log "1 flip: stride=$stride i=$i, [expr {$i+1}] % $stride = [expr {($i+1)%$stride}]"
                    append result [expr {$char==0?1:0}]
                } else {
                    rec log "2 copy: stride=$stride i=$i, [expr {$i+1}] % $stride [expr {($i)%$stride}]"
                    append result $char
                }
            }
            lappend stateList $result 
            return $result
        }
    }
}

set n 10
set c 10
set s "0"
set l "0"
set r "0"
set max 200

set form [ns_conn form]
set n [ns_set get $form n $n]
set s [ns_set get $form s $s]
set c [ns_set get $form c $c]
set l [ns_set get $form l $l]
set r [ns_set get $form r $r]

if {$n <= 0} {
    set n [expr {$n*-1}]
}
if {$n > $max} {
    set n $max
}
set sOriginal $s
if {[string length $s] > $n} {
    set s [string range $s 0 $n-1]
} else {
    set s [string range [string repeat $s $n] 0 $n-1]
}

# set s [join [lreverse [split $s ""]] ""]


# raise upper limit on recursive calls
try {
    interp recursionlimit $myInterp $m
    $myInterp eval [list ::lightswitch::init $c $s]
    for {set stride 1} {$stride<=$c} {incr stride} {
        lappend result [$myInterp eval ::lightswitch::toggle $stride]
    }
    set logs [$myInterp eval ::lightswitch::print log]
    set recursions [interp recursionlimit $myInterp]
    set htmlPage [::wtk::ttt::applyTemplateNS code-2]
    ns_return 200 text/html [lindex $htmlPage end]
} on error {errorTrace optionList} {
    global errorInfo
    set logs "noneyet"
    catch {set logs [$myInterp eval ::lightswitch::print log]}
    append errorInfo "\n--logs=$logs--"
    set errorText [ns_adp_parse -file [ns_url2file /services/return-code/500/internal-server-error.adp]]
    ns_return 500 text/html $errorText
}