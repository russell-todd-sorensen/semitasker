set urlList [lrange [ns_conn urlv] 0 end-1]
lappend urlList code.tcl
set urlToCode /[join $urlList / ]

ns_returnfile 200 text/plain [ns_url2file $urlToCode]