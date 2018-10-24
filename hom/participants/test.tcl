set db [ns_db gethandle pool1]
ns_log Notice "db = '$db'"
set result [ns_db select $db "select now() as rightnow"]
ns_log Notice "result = '$result'"
set row [ns_db getrow $db $result]


if {$row} {
    ns_log Notice "rightnow = [ns_set get $result rightnow]"
}

ns_log Notice "Row = '$row'";
ns_log Notice "Finished"