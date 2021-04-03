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

    if {$fid && ![string match */ $url]} {

        set server [ns_info server]
        set driver [ns_conn driver]
        set host [ns_conn host]
        set hostHeader [ns_set iget [ns_conn headers] host]
        set port [ns_conn port]
        set conn_url [ns_conn url]
        ns_log Notice "hostHeader=$hostHeader,server=$server,host=$host,port=$port conn_url=$conn_url,url=$url"
        ns_log Notice "===>Could redirect to  'https://$hostHeader$conn_url/'"
        ns_returnredirect https://$hostHeader$conn_url/
        ns_adp_abort
    }

 set summary "
    <h3>The URL: $url</h3>
    <li>Exists? = $fie </li>
    <li>url2File = $fullPath </li>
    <li>Is a Directory =  $fid </li>
    <li>Is a Reg File  =  $fif </li>
"
set templateFilename [file join $pagedir services index fancy.cmp]  

set directory $page 
set dir "[string trimright $directory "/"]/"
set file_list [lsort [glob -nocomplain -directory $directory -type f * ]]
set dir_list  [lsort [glob -nocomplain -directory $directory -type d * .* ]]


ns_log Notice "generating templateFile = \[file join $pagedir services index fancy.cmp]"
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
%><%= $__string %>
