set url [ns_conn url]
set splitUrl [split $url /]
set requestedFile [lindex $splitUrl end]
set urlDirectory [join [lrange $splitUrl 0 end-1] /] 
set directory [ns_normalizepath $urlDirectory]/
set pageroot [ns_info pageroot]
set absolutePath [file join $pageroot [string trimleft $directory /]]/
set dataDirectory [file join $absolutePath data]/
set iifFile [file join $dataDirectory "all-customer-data.IIF"]
set patternList [split $requestedFile ".-_ "]
set firstPattern "*[lindex $patternList 0]*"
set matchedFiles [list]
set matchingFileList [list]
set statsHtml [list]


set fd [open $iifFile r ]
set data [chan read $fd]
close $fd
set data [string map {\t ,} $data]
set fdout [open [file join $dataDirectory "pre-process-customer-data-for-glen.csv"] w+]
puts -nonewline $fdout $data
chan seek $fdout 0
set dataFound 0

while {[set cols [ns_getcsv $fdout line]] > -1} {
    append output "cols='$cols' line='$line'\n"
    if {[lindex $line 0] eq "!CUST"} {
        append output "FOUND !CUST at\n$line"
        set nameList $line
        break
    }
}

set csvLink "<a href='data/customer-data-for-glen.csv'>Customer Data</a>"
set csvData "[join $line ,]\n"
set csvLine [list]

set arrayIndex 0
set table "<table id='customers' cellspacing='0' cellpadding='3' border='1'>"
append table " <tr>\n  <th>[join $line "</th>\n  <th>"]  </th>\n </tr>"

set continue 0

while {[set cols [ns_getcsv $fdout line]] > -1} {
    
    set csvLine [list]
    set continue 0
    
    foreach name $nameList value $line {
      set valueTrimmed [string trim $value]
      if {[string first $valueTrimmed " "] > -1 ||
        [string first $valueTrimmed ","] > -1 } {
          set valueTrimmed "\"$valueTrimmed\""
          
      }
      lappend csvLine $valueTrimmed
      
      if {"$name" eq "HIDDEN" && "$value" eq "Y"} {
          set continue 1
          unset csvLine
          unset arr${arrayIndex}
          break
      }
      if {"$name" eq "NAME"} {
          set customer($value) $line
          set customerIndex($value) $arrayIndex
      }
      set arr${arrayIndex}($name) [string trim $value]        
    }
    
    if {"$continue"} {
        continue
    }
    set custArray($arrayIndex) arr$arrayIndex

    append table " <tr>\n  <td><nobr>[join $line "</nobr></td>\n  <td><nobr>"]</nobr></td>\n </tr>"
    append csvData "[join $csvLine ,]\n"
    
    incr arrayIndex
}

close $fdout
set fdout [open [file join $dataDirectory "customer-data-for-glen.csv"] w+] 
puts -nonewline $fdout $csvData

append table "\n</table>"

ns_return 200 text/html "
<!DOCTYPE html>
<html lang='en_US'>
<head>
<meta name='lang' value='UTF-8'/>
<style>
#customers {
    border: 1px solid black;
    border-collapse: collapse;
    
}
    
</style>
</head>
<body>
<pre>
url='$url'
directory='$directory'
absolutePath='$absolutePath'
dataDirectory='$dataDirectory'
arrayIndex='$arrayIndex'
lastCustomer = '[array get arr[incr arrayIndex -1]]'
$output
</pre>
<div>$csvLink</div>
$table
</body>
</html>"