set urlList [lrange [ns_conn urlv] 0 end-1]
ns_log Notice "urlList=$urlList"
set fileNum [ns_conn query]
if {$fileNum == "" || ![string is integer -strict $fileNum]} {
    set file code.tcl
} else {
    set file code-$fileNum.tcl
}

lappend urlList $file
set urlToCode /[join $urlList / ]

ns_returnfile 200 text/plain [ns_url2file $urlToCode]