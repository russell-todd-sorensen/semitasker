set form [ns_conn form]
set ret [ns_set get $form r 0]
set add [ns_set get $form a ""]



ns_log Notice "About to schedule getArrayElementCond"
ns_schedule_proc -once -thread 1 [list ::getArrayElementCond resultArray myResult]
ns_log Notice "Scheduled getArrayElementCond"
ns_log Notice "Locked condOne, about to sleep for five"
ns_sleep 5
ns_log Notice "About to lock condOne"
::lock::cLock condOne
ns_log Notice "Sleep over, about to broadcast condOne"
::lock::Broadcast condOne
ns_log Notice "Broadcast condOne, releasing lock condOne"
::lock::cUnLock condOne
ns_log Notice "released lock condOne, About to sleep another 5"
ns_sleep 5
ns_log Notice "about to lock condOne"
::lock::cLock condOne
ns_log Notice "locked condOne, getting result"
set result [nsv_get resultArray myResult]
ns_log Notice "got result = $result, new schedule then unLocking condOne"

if {$ret} {
    ns_schedule_proc -once -thread 1 [list ::addArrayElementCond $result resultArray myResult]
} elseif {$add ne ""} {
    ns_schedule_proc -once -thread 1 [list ::addArrayElementCond $add resultArray myResult]
}

ns_sleep 5

::lock::Broadcast condOne
::lock::cUnLock condOne
ns_log Notice "unlocked condOne...."

ns_sleep 5
ns_log Notice "about do do final cLock"
::lock::cLock condOne
ns_log Notice "Locked and about to get newVal"
set newVal [nsv_get resultArray myResult]
ns_log Notice "got newVal, returning"
ns_return 200 text/plain "result=$result newVal='$newVal' ret='$ret' add='$add'"
::lock::Broadcast condOne
::lock::cUnLock condOne

