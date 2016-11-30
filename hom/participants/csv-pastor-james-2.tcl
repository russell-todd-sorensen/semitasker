
set pageroot [ns_info pageroot]
set url [ns_conn url]

ns_log Notice "pageroot = '$pageroot'"
ns_log Notice "url = '$url'"

set urlDirectory [file dirname $url]

ns_log Notice "urlDirectory='$urlDirectory'"

set thisDirectory [file join $pageroot [string trim $urlDirectory /]]
set dataDirectory [file join $thisDirectory data]

set csvFile [file join $dataDirectory customer-data-with-balances.csv]
set iifFile [file join $dataDirectory all-customer-data.IIF]
ns_log Notice "iifFile='$csvFile'"

set fd [open $iifFile r]
set fileData [read $fd]

set outFile [file join $dataDirectory all-customer-data.csv]
set fdOut [open $outFile w+]

set outData [regsub -all {\t} $fileData ","]
set start [string first "!CUST,NAME" $outData]
set outData [string range $outData $start end]

puts -nonewline $fdOut $outData
flush $fdOut
seek $fdOut 0

ns_getcsv $fdOut keys

set i 0

set output "house,lastName,firstName,doc,address,arrived\n"
array set rowData {}

while {[ns_getcsv $fdOut data] != -1} {
      array unset rowData
      foreach key $keys value $data {
          set rowData($key) $value
      }
      #ns_log Notice "rowData = $data"
      if {[info exists rowData(CUSTFLD5)] 
        && $rowData(CUSTFLD5) ne ""
        && [info exists rowData(HIDDEN)]
        && $rowData(HIDDEN) ne "Y"
      } {
          
          foreach {item newname} {
              CUSTFLD5 house 
              LASTNAME lastName 
              FIRSTNAME firstName 
              CUSTFLD6 doc 
              BADDR1 baddr1 
              BADDR2 baddr2 
              BADDR3 baddr3
              BADDR4 baddr4
              CTYPE ctype
              CUSTFLD1 startDate
              CUSTFLD2 endDate
          } {
              set $newname $rowData($item)
          }
          set address "$baddr2 $baddr3 $baddr4"
          lappend outputRows "\"[join [list $house $lastName $firstName $doc $address $startDate] "\",\""]\""
          incr i
    }
}

append output [join [lsort $outputRows] "\n"]

ns_return 200 text/csv "$output\n"

