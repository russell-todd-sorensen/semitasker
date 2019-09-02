set urlList [lrange [ns_conn urlv] 0 end-1]
ns_log Notice "urlList=$urlList"
set file [ns_conn query]
if {$file == ""} {
    set file code.tcl
}

lappend urlList $file
set urlToCode /[join $urlList / ]

ns_returnfile 200 text/plain [ns_url2file $urlToCode]