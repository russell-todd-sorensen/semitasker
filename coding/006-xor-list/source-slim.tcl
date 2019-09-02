set urlList [lrange [ns_conn urlv] 0 end-1]
lappend urlList code-slim.tcl
ns_log Notice "llength urlList = [llength $urlList]"
set urlToCode /[join $urlList / ]
set fullPTC [ns_url2file $urlToCode]

ns_log Notice "urlList = $urlList"
ns_log Notice "urlToCode = $urlToCode"
ns_log Notice "fullPTC = $fullPTC"

ns_returnfile 200 text/plain $fullPTC