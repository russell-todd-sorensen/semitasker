
set pageroot [ns_server -server ns pagedir]
set url [ns_conn url]
set filename [file join $pageroot [string trimleft $url / ]]
set dirname [file dirname $filename]
set files [glob -directory $dirname *]
set fd [open [file join $dirname 144000.html] r]
set data [read $fd]

ns_return 200 text/html $data"
