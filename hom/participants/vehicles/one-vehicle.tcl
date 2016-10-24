set form [ns_conn form]

set vehicle_id [ns_set iget $form vehicle_id]

if {![string is integer $vehicle_id]} {
    ns_return 500 text/html "<h2>Vehicle ID isn't an integer</h2>"
    return -code return
}

set db [ns_db gethandle pool1]
set result [ns_db select $db "select * from hom_vehicles where vehicle_id=$vehicle_id"]
set row 0
set output "<table cellspacing='0' cellpadding='3' border='1'>\n"
# even though there is only one row we use this form
while {[ns_db getrow $db $result]} {
    if {$row == 0} {
        for {set i 0} {$i < [ns_set size $result]} {incr i} {
            append output "  <tr>\n"
            append output "    <th>[ns_set key $result $i]</th>\n"
            append output "    <td>[ns_set value $result $i]</td>\n"
            append output "  </tr>\n"
        }
    }
    # we only do one row
    incr row
    break 
}


append output "</table>\n"

ns_return 200 text/html $output