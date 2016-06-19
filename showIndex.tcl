set pageroot [getPageroot $connId]

set prLength [string length $pageroot]
set normalizedDirectory /[string trimleft [string range $dir $prLength end] /]

set pathElements [lrange [split [string trimleft $normalizedDirectory "/"] "/"] 0 end-1]
set finalElement [lrange [split [string trimleft $normalizedDirectory "/"] "/"] end end]

if {$finalElement eq ""} {
    set finalElement "Home Directory"
}

::wtk::log::log Notice "showIndex.tcl: using template cssIndex connId = $connId"
#::t3::respond $connId cssIndex text/html 200 

if {[catch {
    source [file join [file dirname [info script]] cssIndex.tmpl.tcl]
} err]} {
    global errorInfo
    ::wtk::log::log Error "showIndex.tcl: $err"
    ::wtk::log::log Error $errorInfo
    set error [list 500 "$err\r\r$errorInfo"]
    return -code error "$err\r\r$errorInfo"
}

set conn(contentType) text/html
set conn(content) $__string

::wtk::http::server::respond $connId 200 OK