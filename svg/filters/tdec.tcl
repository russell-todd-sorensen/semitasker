
::ext::resource::init 

::ext::resource::add to-decimal-color toDec

set dir [file dirname [ns_url2file [ns_conn url]]]
source [file join $dir hex-valid.tcl.txt]

set modes [list asis css repeat]
set result [::wtk::ttt::applyTemplateNS hex-to-dec]
set content [lindex $result end]
ns_return 200 "text/plain" $content 
