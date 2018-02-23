set db [ns_db gethandle pool1]
ns_log Notice "db = '$db'"
set result [ns_db select $db "select * from hom_vehicles where disp_on is null order by vehicle_id"]
ns_log Notice "result = '$result'"
set row 0
set output "<table cellspacing='0' cellpadding='3' border='1'>\n"
while {[ns_db getrow $db $result]} {
    if {$row == 0} {
        append output "  <tr>\n"
        for {set i 0} {$i < [ns_set size $result]} {incr i} {
            append output "    <th><nobr>[ns_set key $result $i]</nobr></th>\n"
        }
        append output "  </tr>\n"
    }
    
    incr row
    append output "  <tr>\n"

    for {set i 0} {$i < [ns_set size $result]} {incr i} {
        if {[ns_set key $result $i] == "vehicle_id"} {
            append output "    <td><a href='one-vehicle.tcl?vehicle_id=[ns_set value $result $i]'>"
            append output "<nobr>[ns_set value $result $i]</nobr></a></td>\n"
        } else {
            append output "    <td><nobr>[ns_set value $result $i]</nobr></td>\n"
        }
    }
    
    append output "  </tr>\n"
}

append output "</table>\n"

ns_return 200 text/html $output