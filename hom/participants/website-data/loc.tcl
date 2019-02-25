set url [ns_conn url]
set splitUrl [split $url /]
set requestedFile [lindex $splitUrl end]
set urlDirectory [join [lrange $splitUrl 0 end-1] /]
set directory [ns_normalizepath $urlDirectory]/
set pageroot [ns_info pageroot]
set absolutePath [file join $pageroot [string trimleft $directory /]]/
ns_log Notice "absolutePath='$absolutePath' dir='[file dirname $absolutePath]'"
set dataDirectory [file join $absolutePath data]/
ns_log Notice "dataDirector='$dataDirectory'"
set iifFile [file join $dataDirectory "all-customer-data.IIF"]
set patternList [split $requestedFile ".-_ "]

set fd [open $iifFile r ]
set data [chan read $fd]
close $fd
set data [string map {\t ,} $data]

set csvFileName "every-customer.csv"

set fdout [open [file join $dataDirectory $csvFileName] w+]
puts -nonewline $fdout $data
close $fdout

ns_return 200 text/plain $data
