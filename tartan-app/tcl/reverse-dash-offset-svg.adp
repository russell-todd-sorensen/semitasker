<%
    set form [ns_conn form]
    set url [ns_set get $form path]

    set response(content-type) image/svg+xml

    set __string ""
    #set url [ns_conn url]
    set fullPath [ns_url2file $url]
    set page $fullPath
    #set urlv [ns_conn urlv]
    #set urlc [ns_conn urlc]
    set urlv [split $url "/"]
    set urlc [llength $urlv]
    set pagedir [ns_server pagedir]

    set file(exists) [file exists $page]
    set file(isdirectory) [file isdirectory $page]
    set file(isfile) [file isfile $page]
    set fie $file(exists)
    set fid $file(isdirectory)
    set fif $file(isfile)

    if {!$fie | !$fif} {
        ns_log Error "File '$page' exists=$fie isfile=$fif"
        set server [ns_info server]
        set driver [ns_conn driver]
        set host [ns_conn host]
        set hostHeader [ns_set iget [ns_conn headers] host]
        set port [ns_conn port]
        set conn_url [ns_conn url]
        ns_log Notice "hostHeader=$hostHeader,server=$server,host=$host,port=$port conn_url=$conn_url,url=$url"
        ns_log Notice "===>Could redirect to  'https://$hostHeader$conn_url/'"
        #ns_returnredirect https://$hostHeader$conn_url/

        set content [ns_adp_eval [ns_url2file /services/return-code/500/internal-server-error.adp]]
        ns_return 500 "text/html charset=UTF-8" $content
        return -code return
    }

    ns_log Notice "About to parse '$page'"

    set content [ns_adp_parse -file $page]

    set result [string map {x1 y1 x2 y2 y1 x1 y2 x2} $content]

    ns_return 200 $response(content-type) $result  
%>