set problem {
    # ** Define Ackerman's Function minimizing recursive procedure

    # ==> Update: Goal is to produce values of ackermann function if
    #     the answer can be written in a few hundred bytes without 
    #     using the ackermann function in the answer. 
    #     Why: Answers which can't so be written can't be computed by
    #     recursion within the age of our solar system. ;)

    # **  Use Memoizing to avoid recalculating already known results

    # ==> Update: Memoizing just takes up space and doesn't ever get used, try
    #     to remove it in this version.

    # **  use interp with higher stack depth (up to 66k).

    #     Update: Number of recursive calls (not necessarily stack depth works great)!!
    #     No need to enforce low limit. Recursive calls are about 2*Decremented number
    # 
    # **  use interp results to develop coroutine to generate stack results
    #     Update: ??
}

set solution {
    # The function requires a recursive procedure
    # Since Tcl is now stackless, this should work ok in tcl.
    #include <stdio.h>

    The following solution almost does away with the recursion,
    the software cannot calculate fn(4,2) == 2^(65533+3) -3
    There is another limit for fn(3,*)
    fn(3,1020) = 2^(1020+3)-3 = 89884656743115795386465259539451236680898848947115328636715040578866337902750481566354238661203768010560056939935696678829394884407208311246423715319737062188883946712432742638151109800623047059726541476042502884419075341171231440736956555270413618581675255342293149119973622969239858152417678164812112068605
    fn(4,2) is done in because fn(4,2) = fn(3,65533) == (2^(65533+3) - 3) (as above) 

    All of these can be calculated with at most one recursive entry from fn(4,*) to fn(3,*), 
    which can be calculated exactly, and actually you could extend this to infinity almost
    because fn(4,n) first calls fn(4,n-1), then fn(4,n-2)...

    Beyond this, if you start at fn(5,x) or fn(6,x) eventually recurse to fn(4,65533), Which requires a stack at 
    least 66k.

    New in code-2.tcl:

    Works up to φ(5,1) == φ(6,0) == (2↑↑65548)-3 == 2^2^2^2...^2 -3
                                           ^-65548x-^
    Works with arbitrary "stack" size (separate interp has increased recursion limit)
}


if {[llength [info proc deleteInterp]] == 0} {
    proc deleteInterp {alias} {
        if {[interp exists $alias]} {
            interp delete $alias
        }
    }
}

deleteInterp ack

set myInterp [interp create ack]
ns_atclose deleteInterp $myInterp


interp eval $myInterp {
    global log
    global COUNTER c

    set log [list]

    if {[namespace exists ackermann]} {
        namespace delete ackermann
    }

    namespace eval ::ak {
        variable cache
        variable hits
        variable maxEntries 1000
        variable maxRecursions
        variable COUNTER 0
        variable log [list]
        variable sym
        
        set sym(phi) φ
        set sym(alpha) α

        # https://www.compart.com/en/unicode/block/U+2190

        set sym(ua) ↑
        set sym(ua2) ꜛ 
        set sym(ua3) ↑  ;# https://www.compart.com/en/unicode/U+2191
        set sym(ra) →   ;# https://www.compart.com/en/unicode/U+2192
        set sym(uda) ⇑  ;# https://www.compart.com/en/unicode/U+21D1
        set sym(uda2) ⇧ ;# https://www.compart.com/en/unicode/U+21E7


        proc rec {logName what} {
            variable $logName
            lappend $logName $what
        }

        proc printLog {logName {joinBy \n} {reset 0} args} {
            variable $logName
            if {[llength $args] == 0} {
                set args [list {0 end}]
            }
            set result ".......LOGS........\n"

            foreach range $args {
                set start [lindex $range 0]
                set end [lindex $range 1]
                append result ".....From Lines $start to $end.....$joinBy"
                append result [join [lrange [set $logName] $start $end] $joinBy] $joinBy
            }

            if {$reset} {
                set $logName [list]
            }
            return $result
        }
        proc simplify {nList} {
            variable sym
            set originalList $nList
            set stack [list]
            set depth 0
            set m3 [lindex $nList 2]
            while {[llength $nList] == 3} {
                lassign $nList base nList m
                if {$m == 0} {
                    incr depth
                }
            }
            if {![string is integer -strict $nList]} {
                return $originalList
            }
            if {$base eq "2$sym(ua)"} {
                set nList [list $base$sym(ua) [expr {$nList + $depth}] $m3]
            } else {
                return $originalList
            }
            return $nList
        }
        proc fromSimpleToInt {nList} {
            lassign $nList base exp m 
            if {[string is integer -strict $exp] && $exp < 17} {
                set val [expr {2**$exp + $m}]
                rec log "fromSimpleToInt '$base $exp $m' val='$val'"
                return $val
            } else {
                #rec log "Probably about to crash...$base $exp $m"
                return $nList
            }
        }

        proc $sym(ua) {h m n} {
            variable sym
            
        }

        proc $sym(phi) {m n} {
            variable COUNTER
            variable maxRecursions
            variable cache
            variable hits
            variable maxEntries
            variable log
            variable sym

            set cacheHits ""

            incr COUNTER

            if {[info exists hits($m,$n)]} {
                incr hits($m,$n)
                rec log "+cacheHits $m,$n = $hits($m,$n)"
                
                return $cache($m,$n)
            } else {
                set hits($m,$n) 0
            }

            rec log "B=[format %0.7d $COUNTER] $sym(phi)($m,$n)"

            if {$COUNTER > $maxRecursions} {
                rec log "maxRecursions $maxRecursions reached m=$m, n=$n ans='not determined'"
                return 0
            }
            switch -exact -nocase -- $m {
                0 {
                    set cache(0,$n) [expr {$n + 1}]
                }
                1 {
                    set cache(1,$n) [expr {$n + 2}]
                }
                2 {
                    set cache(2,$n) [expr {2*($m+$n) - 1}]
                }
                3 {
                    if {![string is integer -strict $n]} {
                        set base [lindex $n 0]
                        set exp  [lindex $n 1]
                        set int  [lindex $n 2]
                        set exp2 [expr {$int + 3}] 
                        set n+3  [list 2$sym(ua) $exp $exp2]
                        set n2   [list $base ${n+3} -3]
                        set simp [simplify $n2]
                        set cache(3,$n) $simp ;# was $n2
                        #rec log [join [list " base='$base'" "exp='$exp'" "int='$int'" "exp2='$exp2'" "n+3='[set "n+3"]'" "n2='$n2'" "simp='$simp'"] "\n "]
                    } elseif {$n > 1020} {
                        # the next calculation will go bust, can I return it symbolically?
                        set cache(3,$n) [list 2$sym(ua) [expr {$n+3}] -3]
                    } else {
                        #set cache(3,$n) [expr {int(pow(2,$n+$m))-3}]
                        set cache(3,$n) [list 2$sym(ua) [expr {$n+3}] -3]
                    }
                } 
                default {
                    if {$n == 0} {
                        set mt [expr {$m-1}]
                    
                        if {[info exists cache($mt,1)]} {
                            incr hits($mt,1)
                            rec log "cacheHits ==> hits($mt,1) = $hits($mt,1)"
                            return $cache($mt,1)
                        }
                        set cache($m,$n) [$sym(phi) $mt 1]
                        set hits($m,$n) 0
                    } else {
                        if {![string is integer -strict $m]} {
                            set m [fromSimpleToInt $m]
                        }
                        set mt [expr {$m-1}]
                        if {![string is integer -strict $n]} {
                            set n [fromSimpleToInt $n]
                        }
                        # rec log ">>n = '$n'"
                        set nt [expr {$n-1}]
                        if {[info exists cache($m,$nt)]}  {
                            set vt $cache($m,$nt)
                            incr hits($m,$nt)
                        } else {
                            set vt [$sym(phi) $m $nt]
                        }
                        if {[info exists cache($mt,$vt)]} {
                            set cache($m,$n) $cache($mt,$vt)
                            incr hits($mt,$vt)
                        } else {
                            # rec log "caching mt='$mt' ([string is integer -strict $mt]), vt='$vt' ([string is integer -strict $vt])"
                            if {![string is integer -strict $vt]} {
                                set orgVt $vt
                                #set vt [fromSimpleToInt $vt]
                                set vt [fromSimpleToInt $vt]
                                if {$vt > 10000} {
                                    set vt $orgVt
                                }
                            }
                            set cache($m,$n) [$sym(phi) $mt $vt]
                            set hits($m,$n) 0
                        }
                    }
                }
            }
            rec log "E=[format %0.7d $COUNTER] $sym(phi)($m,$n)=[join $cache($m,$n) ""] hits=$hits($m,$n)"
            return $cache($m,$n)
        }

        proc init {{c 10000} } {
            variable COUNTER 0
            variable maxRecursions $c
            variable cache
            variable hits
            variable maxEntries $c
        }
    }
}
set m 0
set n 0
set c 500000
set r 2000 ;# stack depth (recursions)
set COUNTER 0

set form [ns_conn form]
set m [ns_set get $form m $m]
set n [ns_set get $form n $n]
set c [ns_set get $form c $c]
set r [ns_set get $form r $r]

if {$c > 500000} {
    set c 500000
}

global sym
        
set sym(phi) φ
set sym(alpha) α
set sym(ua) ↑

interp recursionlimit $myInterp $r
interp eval $myInterp ::ak::init $c

try {
    set result [interp eval $myInterp ::ak::$sym(phi) $m $n]
} on error {e} {
    global errorInfo
    set result "error $e \n $errorInfo"
    if {[string length $result] > 1000} {
        set begin "[string range $result 0 499]\n...Finally...\n\n"
        append begin [string range $result end-500 end]
        set result $begin
    }
}

set hits ""
set sortedHits [list] ;# [lsort -stride 2 [interp eval $myInterp array get ::ak::hits]] ;#

foreach {def count} $sortedHits {
    append hits "$def = $count value=[interp eval $myInterp [list set "::ak::cache($def)"]]\n"
}

set len [expr {[llength $sortedHits]/2}]

set ackermannURLs [list]
# calculate links to other Ackermann Implimentations:
proc createLink {m n c {r c}} {

}

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Ack Knuth-up-arrow V4</title>
<style>
#c,
#n,
#m,
#m2 {
    width: 75px;
}
#form1 li {
    height: 1.5em;
}
</style>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form id='form1' autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='m'>M (small int)</label>
  <input name='m' id='m'  value='$m'>
 </li>
 <li>
  <label for='n'>N (small int)</label>
  <input name='n' id='n' value='$n'>
 </li>
 <li>
  <label for='c'>Max Iterations (small int)</label>
  <input name='c' id='c' value='$c'>
 </li>
 <li>
  <label for='r'>Max Recusive Depth</label>
  <input name='r' id='r' value='$r'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl?3'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
m = '$m'
n = '$n'
max Recursive Depth = '[interp recursionlimit $myInterp]'
Total Iterations = '[interp eval $myInterp set ::ak::COUNTER]'
::ak::$sym(phi)($m,$n) = $result
logs = 
[interp eval $myInterp {::ak::printLog log \n 0 {0 100} {end-100 end}} ] 
cache size = $len
----- CACHE -------
$hits
</pre>
</body>
</html>"
