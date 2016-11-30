
set pageroot [ns_info pageroot]
set url [ns_conn url]

ns_log Notice "pageroot = '$pageroot'"
ns_log Notice "url = '$url'"

set urlDirectory [file dirname $url]

ns_log Notice "urlDirectory='$urlDirectory'"

set thisDirectory [file join $pageroot [string trim $urlDirectory /]]



#set thisDirectory [file dirname [info script]]
ns_log Notice "thisDirectory='$thisDirectory'"

set dataDirectory [file join $thisDirectory data]

set csvFile [file join $dataDirectory customer-data-with-balances.csv]
ns_log Notice "csvFile='$csvFile'"

set fd [open $csvFile r]

ns_getcsv $fd keys
set i 0
set output "\"[join $keys "\",\""]\"\n" 
while {[ns_getcsv $fd data] != -1} {
 
       append output "\"[join $data "\",\""]\"\n" 
    
}

ns_return 200 text/csv $output

