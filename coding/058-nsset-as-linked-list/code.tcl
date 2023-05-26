set problem {
    #demonstrate usage of tcl interp for safe computing
}

set solution {
    # Mostly interested in using interp to change the recursion limit
    # for massively recursive procedures.
    # The current build in limit is 1000.
}

if {[llength [info proc deleteNamespace]] == 0} {
    proc deleteNamespace {{ns ""}} {
        if {[namespace exists $ns]} {
            namespace delete $ns
        }
    }
}
set myNamespace ::llns
deleteNamespace $myNamespace

ns_atclose deleteNamespace $myNamespace

namespace eval $myNamespace {

    namespace eval log {
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

        proc init {} {
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
    namespace eval ll {
        variable sep .
        variable bigset [ns_set create bigset]
        namespace import -force ::llns::log::*
        init
        new log

        proc make {map} {
            variable sep
            variable bigset
            foreach nvPair $map {
                ns_set put $bigset {*}$nvPair
                rec log "ns_set put $bigset $nvPair"
            }
            return "size:[ns_set size $bigset],names:[ns_set keys $bigset]"
        }
        proc keys {{varname keys} {pattern *}} {
            variable bigset
            upvar 1 $varname val
            set val [ns_set keys $bigset $pattern ]
            ns_log Notice "looking for keys with pattern $pattern, found: '$val'"
        }
        proc getBigSet {} {
            variable bigset
            return $bigset
        }
        proc getByIndex {index} {
            variable bigset
            uplevel 1 [list append __string [ns_set value $bigset $index]]
        }
        proc getByKey {key} {
            variable bigset
            uplevel 1 [list append __string [ns_set get $bigset $key]]
        }
    }
}

set r 2 ;# rows
set c 2 ;# cols
set d 10000;# max recursive depth

set maxR 1000
set maxC 1000
set maxD 100000

set form [ns_conn form]
set r [expr {abs([ns_set get $form r $r])}]
set c [ns_set get $form c $c]
set d [ns_set get $form d $d]

if {$r > $maxR} {
    set r $maxR
}

if {$c > $maxC} {
    set c $maxC
}
if {$d > $maxD} {
    set d $maxD
}
set index 0
set map   [list]
for {set row 0} {$row<$r} {incr row} {
    
    for {set col 0} {$col<$c} {incr col} {
        set name .${row}.${col}.
        lappend map [list $index $name]
        incr index
    }
}

# raise upper limit on recursive calls
try {
    set result [${myNamespace}::ll::make $map]
    set logs [${myNamespace}::ll::print log]


    ::ext::resource::init
    ::ext::resource::add getByIndex ${myNamespace}::ll::getByIndex
    ::ext::resource::add getByKey ${myNamespace}::ll::getByKey
    ::ext::resource::add keys ${myNamespace}::ll::keys
    ::ext::resource::add echo ::ext::resource::echo

    set htmlPage [::wtk::ttt::applyTemplateNS code]
    ns_return 200 "text/html; charset=utf-8" [lindex $htmlPage end]
} on error {errorTrace optionList} {
    global errorInfo
    set logs "noneyet"
    catch {set logs [${myNamespace}::ll::print log]}
    append errorInfo "\n--logs=$logs--"
    set errorText [ns_adp_parse -file [ns_url2file /services/return-code/500/internal-server-error.adp]]
    ns_return 500 "text/html; charset=utf-8" $errorText
}