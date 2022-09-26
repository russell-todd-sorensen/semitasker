
set m 0
set n 0
set c 500000
set r 2000 ;# stack depth (recursions)
set z 1 ;# trigger recursion limits on old code
set COUNTER 0

set form [ns_conn form]
set m [ns_set get $form m $m]
set n [ns_set get $form n $n]
set c [ns_set get $form c $c]
set r [ns_set get $form r $r]
set z [ns_set get $form z $z]

if {$c > 500000} {
    set c 500000
}

global sym
        
set sym(phi) φ
set sym(alpha) α
set sym(ua) ↑

set urls [list /coding/029-ackermann-recursive/code.tcl \
    /coding/030-ackermann-recursive-with-memory/code.tcl \
    /coding/033-ackermann-recursive-with-symbolic/code-2.tcl \
    /coding/039-ackermann-up-arrow/code-5.tcl \
    /coding/039-ackermann-up-arrow/code-3.tcl \
    code-n.tcl]

set template "code"



set response [::wtk::ttt::applyTemplateNS code]
ns_log Notice "::wtk::binDir='$wtk::ttt::binDir'"
ns_log Notice "applyTemplate response='$response'"
ns_return [lindex $response 0] "text/html; charset=utf-8" [lindex $response 2]
