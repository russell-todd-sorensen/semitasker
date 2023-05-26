if {[llength [info proc deleteNamespace]] == 0} {
    proc deleteNamespace {{ns ""}} {
        if {[namespace exists $ns]} {
            namespace delete $ns
        }
    }
}

set myNamespace ::ll
deleteNamespace $myNamespace

ns_atclose deleteNamespace $myNamespace

set this [ns_url2file [ns_conn url]]
set dir [file dirname $this]
set journal [file join $dir journal.tcl]
source $journal
ns_log Notice "this='$this' dir='$dir'"
namespace eval $myNamespace {

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
    
}

try {
   # set result [${myNamespace}::ll::make $map]
   # set logs [${myNamespace}::ll::print log]
    set result "old result"
    set keys [list]
    set logs [list]
   # ::ext::resource::init
   # ::ext::resource::add getByIndex ${myNamespace}::ll::getByIndex
   # ::ext::resource::add getByKey ${myNamespace}::ll::getByKey
   # ::ext::resource::add keys ${myNamespace}::ll::keys
   # ::ext::resource::add echo ::ext::resource::echo
   set cSets [list]

   for {set i 0} {$i < $c} {incr i} {
        set set($i) [ns_set create]
        ns_set put $set($i) val $i 
        lappend cSets $set($i)
   }
   set result $cSets

   set htmlPage [::wtk::ttt::applyTemplateNS code-2]
   ns_return 200 "text/html; charset=utf-8" [lindex $htmlPage 2]
} on error {errorTrace optionList} {
    global errorInfo
    set logs "noneyet"
    #catch {set logs [${myNamespace}::print log]}
    append errorInfo "\n--logs=$logs--"
    set errorText [ns_adp_parse -file [ns_url2file /services/return-code/500/internal-server-error.adp]]
    ns_return 500 "text/html; charset=utf-8" $errorText
}