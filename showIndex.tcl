set pageroot [ns_info pagedir]

set prLength [string length $pageroot]
set normalizedDirectory /[string trimleft [string range $dir $prLength end] /]

set pathElements [lrange [split [string trimleft $normalizedDirectory "/"] "/"] 0 end-1]
set finalElement [lrange [split [string trimleft $normalizedDirectory "/"] "/"] end end]

if {$finalElement eq ""} {
    set finalElement "Home Directory"
}

::wtk::log::log Notice "showIndex.tcl: using template cssIndex on $normalizedDirectory"

if {[catch {
    source [file join [file dirname [info script]] cssIndex.tmpl.tcl]
} err]} {
    global errorInfo
    ::wtk::log::log Error "showIndex.tcl: $err"
    ::wtk::log::log Error $errorInfo

    ns_return 500 text/html "<!DOCTYPE html>
<html lang='en-US'>
<head>
<title>$err</title>
</head>
<body>
<h2>$err</h2>
<pre>
$errorInfo
</pre>
</body>
</html>"
    return -code return
}

set contentType text/html

ns_return 200 $contentType $__string