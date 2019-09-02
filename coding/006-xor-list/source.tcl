set urlList [lrange [ns_conn urlv] 0 end-1]
lappend urlList code.tcl
ns_log Notice "llength urlList = [llength $urlList]"
set urlToCode /[join $urlList / ]
set fullPTC [ns_url2file $urlToCode]

ns_log Notice "urlList = $urlList"
ns_log Notice "urlToCode = $urlToCode"
ns_log Notice "fullPTC = $fullPTC"
#set fd [open $fullPTC r]
#fconfigure $fd -translation binary -encoding binary
#set source [read $fd]
#close $fd

#ns_return 200 text/plain $source
ns_returnfile 200 text/plain $fullPTC