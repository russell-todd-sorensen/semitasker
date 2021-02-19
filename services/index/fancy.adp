<!DOCTYPE html>
 <%
    set __string ""
    set url [ns_conn url]
    set fullPath [ns_url2file $url]
    set page $fullPath
    
    set urlv [ns_conn urlv]
    set urlc [ns_conn urlc]
    set pagedir [ns_server pagedir]

    set file(exists) [file exists $page]
    set file(isdirectory) [file isdirectory $page]
    set file(isfile) [file isfile $page]
    set fie $file(exists)
    set fid $file(isdirectory)
    set fif $file(isfile)

 set summary "
    <h3>The URL: $url</h3>
    <li>Exists? = $fie </li>
    <li>url2File = $fullPath </li>
    <li>Is a Directory =  $fid </li>
    <li>Is a Reg File  =  $fif </li>
"
set templateFilename [file join $pagedir services index fancy.cmp]

if {!$fid} {
    #append summary "<h3>no directory here</h3>"
} else {
    if {[catch {
        source $templateFilename
    } err]} {
        global errorInfo
        ns_log Error $errorInfo
        append __string "
    <h2>$err</h2>
    <pre>
    $errorInfo
    </pre>"
    }
}

%>

<%= $__string %>