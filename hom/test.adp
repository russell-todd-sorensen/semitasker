<!DOCTYPE html>
<html>
<head>
</head>
<body>
<p>

<% ns_adp_puts "This is okay"  %>
</p>

<%
set db [ns_db gethandle pool1]

set result [ns_db select $db "select * from hom_houses order by house_name"]
set westernHeader "-- Western Washington --"
set easternHeader "-- Eastern Washington --"
set westernHouseList [list $westernHeader ]
set easternHouseList [list $easternHeader ]
ns_adp_puts "<ul>"
set westernHouseOptions " <option value=''>$westernHeader</option>"
set easternHouseOptions " <option value=''>$easternHeader</option>"
set formattedAddresses ""

while {[ns_db getrow $db $result]} {
    set house [ns_set get $result house_name]
    set city  [ns_set get $result house_city]
    set house_addr1 [ns_set get $result house_addr1]
    set house_addr2 [ns_set get $result house_addr2]
    set house_addr3 [ns_set get $result house_addr3]
    set state [ns_set get $result house_state]
    set zip [ns_set get $result house_zip]
    set formattedAddress($house) "\n<pre>$house_addr1\n$house_addr2\n$city, $state $zip</pre>"
    append formattedAddresses $formattedAddress($house)
    ns_log Notice "house = '$house'"
    ns_adp_puts "<li>house = '$house'</li>"
    if {$city == "Spokane" || $city == "Yakima"} {
        lappend easternHouseList $house
        append easternHouseOptions "\n <option value='$house'>$house</option>"
    } else {
        lappend westernHouseList $house
        append westernHouseOptions "\n <option value='$house'>$house</option>"
    } 
}

set houseOptionString [join [concat $westernHouseList $easternHouseList] ","]

ns_adp_puts "</ul>"

ns_adp_puts "<select name='house' id='house'>"
ns_adp_puts $westernHouseOptions
ns_adp_puts $easternHouseOptions
ns_adp_puts "</select>"

ns_adp_puts $formattedAddresses
ns_adp_puts $houseOptionString
%>
</body>
</html>