set db [ns_db gethandle pool1]
ns_log Notice "db = '$db'"
set result [ns_db select $db "select * from hom_vehicles where disp_on is null order by vehicle_id"]
ns_log Notice "result = '$result'"
set row 0
set rows [list]
set outputRow [list]
while {[ns_db getrow $db $result]} {
    if {$row == 0} {

        for {set i 0} {$i < [ns_set size $result]} {incr i} {
            lappend outputRow "[ns_set key $result $i]"
        }
        lappend rows [join $outputRow ,]
    }
    
    incr row
    set outputRow [list]
    for {set i 0} {$i < [ns_set size $result]} {incr i} {
            lappend outputRow "\"[string map [list \" \"\"] [ns_set value $result $i]]\""
    }
    lappend rows [join $outputRow ,]
}



ns_return 200 text/csv [join $rows \n]