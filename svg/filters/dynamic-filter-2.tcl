
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

set dir [file dirname [ns_url2file [ns_conn url]]]
source [file join $dir hex-valid.tcl.txt]

#### Defaults #####

set opacity 1.0
set dur 30
set start 0
set black "000000FF"
set white "FFFFFFFF"
set r "indefinite"
set h ""   ;#"$black,$white"
set t "0"
set typeMap [list "0" "html" "1" "svg"]
set b "0:0:0:0" ; # "0px:4px:30s:Infinite"
set p "https://home.highfivediet.com/images/mset-opt/mset-6131.png"
set s "0,end" ; # 0 based index helps repeat white,
                # end keyword helps repeat black,
                # user supplied schedule should not use 0 or end for
                # other colors
# Ukraine colors:
# bluish: #0057B7FF
# yellowish: #FFD700FF
#
array set colorIndex [list 0 $black end $white]

set form        [ns_conn form]

set h           [ns_set get $form h $h]
set hexValMap   [split $h ","]

foreach hvm $hexValMap {
    lassign [split $hvm ":"] ind col
    set colorIndex($ind) $col
}

set b           [ns_set get $form b $b]
set blurComponents [list blurMinPx blurMaxPx animDur animRepeat]
lassign [split $b ":"] {*}$blurComponents

foreach part {blurMinPx blurMaxPx} {
    set val [set $part]
    if {$val == ""} {
        set blurMinPx "0"
        continue
    }

    set res [scan $val "%f%s" bv bu]
    switch -exact -- $res {
        2 - 1 {
            if {$bv == 0.0} {
                set $part 0
            } else {
                set $part ${bv}px
            }
        }
        default {
            set $part 0
        }
    }
}
set res [scan $animDur "%f%s" dv du]
switch -exact -- $res {
    2 {
        if {$dv == 0.0} {
            set animDur 0
        } else {
            set animDur ${dv}$du
        }
    }
    1 {
        if {$dv == 0.0} {
            set animDur 0
        } else {
            set animDur ${dv}s
        }
    }
    default {
        set animDur 0
    }
}
switch -exact -- $animRepeat {
    "Infinite" - "0" {
        # do nothing 
    }
    default {
        set res [scan $animRepeat %d av]
        if {$res < 1} {
            set animRepeat 0
        } else {
            set animRepeat $av
        }
    }
}

set b "${blurMinPx}:${blurMaxPx}:${animDur}:$animRepeat"
set v "0:0:2000:1500"
set v [ns_set get $form v $v]
set viewBox [split $v ":"]

foreach {index color} [array get colorIndex] {
    set pass [toDec C$index $color asis]
    set aName C$index
    if {$pass != 4} {
        set pass [toDec C$index "00000000" asis]
    }
    foreach chan {r g b a} {
        set ${aName}(${chan}f) [expr {[set ${aName}(${chan}d)]/255.0}]
    }
    dict set colorDict $aName [array get $aName]
    
}
ns_log Notice "colorDict=$colorDict"

set s           [ns_set get $form s $s]
set colorSched  [split $s ","]

set t           [ns_set get $form t $t]
set type        [string map $typeMap $t]

set p           [ns_set get $form p $p]

set r           [ns_set get $form r $r]

ns_log Notice "dynamic-filter-2.tcl t='$t',type='$type'"

#detect media type
set media_filename [file extension $p]
set media_full_type [ns_guesstype $media_filename]

switch -glob -- $media_full_type {
    "image/*" {
        set media_type "image"
    }
    "video/*" {
        set media_type "video"
    }
    default {
        set media_type "image"
    }
}
ns_log Notice "media_filename='$media_filename', media_full_type='$media_full_type', media_type='$media_type'"

#set url "[ns_conn location][string map {"t=1" "t=0"} [lindex [ns_conn request] 1]]"
set url_loc [ns_conn location]
set url_url [ns_conn url]
set url ""
append url $url_loc $url_url "?"
# rebuild query for link in SVG document
# query vars:
set encoded_url_query_terms [list "t=0"]
foreach qvar {p h s b v} {
    lappend encoded_url_query_terms "[ns_urlencode $qvar]=[ns_urlencode [set $qvar]]"
}
set url_query [join $encoded_url_query_terms "&amp;"]

append url $url_query


ns_log Notice "url='$url'"

set svgDoc      [::wtk::ttt::applyTemplateNS svg-filter]

set svg_content [lindex $svgDoc end]
if {$type eq "svg"} {
    ns_return 200 "image/svg+xml" $svg_content
    return -code return
}

set __string ""

foreach {typeId typeName} $typeMap {
    set tChecked$typeId ""
}
set tChecked$t "checked"

set htmlContent [::wtk::ttt::applyTemplateNS dynamic-filter-2]
ns_return 200 text/html [lindex $htmlContent end]