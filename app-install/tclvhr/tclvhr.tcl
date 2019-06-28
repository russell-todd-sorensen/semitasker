#######################################################################
# tclvhr version 0.1.1 # GPL 2000
# Version 0.1.1 Now works with the url2file proxy version 0.1.1 
# This module is based on a path based proxy by: 
# Mike Hoegeman <hmail@gte.net>
# This version allows all normal configuration to be done through the 
# nsd.tcl file. 
# 
# nsd.tcl configuration options.
# ns_section "ns/server/${servername}/module/tclvhr"
# ns_param   method         POST
# ns_param   method         GET
# ns_param   method         HEAD
# ns_param   timeout        30
# ns_param   errorurl       "http://publicdomain.com/error.txt"
# ns_param   busyurl        "http://publicdomain.com/busy.txt"
# ns_param   breaktrace     1 ;# Set to 0 to run trace filters.
#
#
# ns_section "ns/server/${servername}/module/tclvhr/maps"
# Next three lines register each method explicitly:
# ns_param    {GET:http:public.com:8000}  {GET:http:192.168.111.10:9000}
# ns_param   {POST:http:public.com:8000} {POST:http:192.168.111.10:9000}
# ns_param   {HEAD:http:public.com:8000} {HEAD:http:192.168.111.10:9000}
# Following map registers methods listed in "../module/tclvhr" ns_section,
# and is equivalent to the previous three map entries in this example:
# ns_param      {*:http:public.com:8000}    {*:http:192.168.111.10:9000} 
# If Request is coming in on port 80, leave out :port.
# ns_param             {*:http:dom1.com}    {*:http:192.168.111.10:9000}
# SSL Requests can be redirected to a private ip, the target method is 
# ignored for now:
# ns_param            {*:https:dom1.com}     {*:http:192.168.111.5:4000}
# 
# 
# Installation:
# 1. Create a subdirectory in your private tcl library directory
#    called tclvhr.
#    If your nsd.tcl file has the following section:
#       ns_section "ns/server/${servername}/tcl"
#       ns_param Library /web/myserver/tcl
# 
#    $ mkdir /web/myserver/tcl/tclvhr
# 2. Copy this file to that directory. 
# 3. If you are using the ACS or OpenACS
#    execute this command:
#    $ echo 'source /web/myserver/tcl/tclvhr/tcvhr.tcl' >> /web/myserver/tcl/init.tcl
# 
# 4. Otherwise, add the module to your nsd.tcl file.
#    In the ns_section "ns/${servername}/modules":
#    ns_param   tclvhr   tcl
#    This should be right after all your .so modules.
# 5. Restart your server and you should see one line for each map created and one
#    line for each method registered.
# 6. Report any problems to Tom Jackson: <tom@rmadilo.com>
#
# Notes:
# You must set the location parameter correctly in your proxied hosts'
# startup file nsd.tcl.
#
# If you want your web domain name to be www.example.com
# set up the following in you nsd.tcl file:
# ns_section "ns/server/${servername}/module/nssock"
# ns_param        port          8000                    ;# Actual private port 
# ns_param        hostname      www.example.com        ;# Internet Hostname
# ns_param        address       192.168.1.2             ;# Actual private ip
# ns_param        location      http://www.example.com ;# Protocol://Hostname
# The location parameter is essential for automatic redirects and for proper
# use of [ns_conn location], otherwise redirect would go to 
# http://www.example.com:8000
# 
# If moving from 2.3.3 to 3.0, ns_adp_include -sameframe is no longer supported.
# You will have to replace it with ns_adp_include $filename arg1 arg2 . . .
# and in the $filename call ns_adp_bind_args var1 var2 . . . 2.3.3 supports both.
#
# Each mapping is created as an array with the following structure:
# Array Name: {method:protocol:host[:port]} 
# Elements:
#             address: {method:protocol:host:port}
#             timeout: integer
#            errorurl: some url: http://publicdomain.com/error.txt
#             busyurl: some url: http://publicdomain.com/busy.txt
#            
# Although you have control over the address element for each mapping,
# the other variables are determined by values set under the main tclvhr ns_section.
# You can set these to different values at any time after initialization by executing
# the following command:
# nsv_set $address element newvalue
# 
# You can adjust the number of mutexes supporting these arrays by changing the number
# of nsvbuckets:
# ns_section "ns/server/${servername}/tcl"
# ns_param     nsvbuckets       8 ;# 8 is the default.

proc Notice {s} {ns_log Notice $s}
proc Debug  {s} {ns_log Debug  $s}
proc Init   { servername } {
    ns_log notice "Initializing tclvhr module for $servername."
    
    set main_config  [ns_configsection "ns/server/${servername}/module/tclvhr"]
    set size         [ns_set size $main_config]
    nsv_set          ProxyParameters method_list  [list]
    set busyurl      ""
    set errorurl     ""
    
    for {set i 0 } { $i < $size } {incr i} {
        set key   [ns_set   key $main_config $i]
        set value [ns_set value $main_config $i]
        switch [string tolower $key] {
            "method"   {
                nsv_lappend ProxyParameters method_list $value
            }
            "timeout"  {
                nsv_set ProxyParameters timeout  $value
            }
            "busyurl"  {
                nsv_set ProxyParameters busyurl  $value
            }
            "errorurl" {
                nsv_set ProxyParameters errorurl $value
            }
            "breaktrace" {
                nsv_set ProxyParameters breaktrace $value
            }
            default    {
                nsv_set ProxyParameters $key     $value
            }
        }
    }
    if {![nsv_exists ProxyParameters "breaktrace"]} {
        nsv_set ProxyParameters "breaktrace" 1
    }
    set config_set [ns_configsection "ns/server/${servername}/module/tclvhr/maps"]
    set size [ns_set size $config_set]
    for {set i 0 } { $i < $size } {incr i} {
        
        set filter_methods [list]
        set key            [ns_set   key $config_set $i]
        set value          [ns_set value $config_set $i]
        set key_list       [split   $key ":"]
        set value_list     [split $value ":"]
        set key_end        [join [lrange   $key_list 1 end] ":"]
        set value_end      [join [lrange $value_list 1 end] ":"]
        set method         [lindex $key_list 0]
        
        set filter_methods [list $method]
        if { [string match \*  $method ] } { 
            set filter_methods [nsv_get ProxyParameters method_list]
        }
        
        foreach m $filter_methods {
            set key   ${m}:${key_end}   
            set value ${m}:${value_end}
            ns_log notice "$key --> $value"
            nsv_set "$key" address    "$value"
            nsv_set "$key" timeout    [nsv_get ProxyParameters timeout   ]
            nsv_set "$key" busyurl    [nsv_get ProxyParameters busyurl   ]
            nsv_set "$key" errorurl   [nsv_get ProxyParameters errorurl  ]
            nsv_set "$key" breaktrace [nsv_get ProxyParameters breaktrace]
        }
    }  
    if {![nsv_exists ProxyParameters filters_on]} {
        foreach op [nsv_get ProxyParameters method_list] {
            Notice "!!! ns_register_filter preauth  $op /* Switch"
            Notice "!!! ns_register_filter trace    $op /* BreakTrace"
            ns_register_filter preauth $op /* Switch
            ns_register_filter trace   $op /* BreakTrace
        }  
        
        nsv_set ProxyParameters filters_on 1
        ns_log notice "Finished Registering Proxy Filters."
    }
}
proc BreakTrace { why } {
    global BreakTrace
    if {[info exists BreakTrace] && $BreakTrace} {
        Debug "Aborting Trace Filter Execution"
        return filter_return
    } else {
        Debug "Continuing Trace Filter Execution"
        return filter_ok
    }

}
proc Switch { why } {
    global BreakTrace

    # Input
    switch [ns_conn driver] {
        "nsssl" - "nsssle" {
            set protocol "https"
        }
        "nssock" - default {
            set protocol "http"
        }
    }
    set method    [ns_conn method]
    set host      [string tolower [ns_set iget [ns_conn headers] Host]]
    set hostname  [lindex [split $host ":"] 0]
    set key       "${method}:${protocol}:$host"
    if {![nsv_exists "$key" address]} {
        ns_log Debug "No proxy for $key"
        set BreakTrace 0
        return filter_ok
    }
    set BreakTrace [nsv_get $key breaktrace]
    # Output
    if {[catch {
        set value          [nsv_get $key address]
    } err ]} {
        # Dont think this will ever happen
        ns_returnredirect  [nsv_get $key busyurl]
        ns_log Error       "$key not found "
        return filter_return
    }
    set redirect_list  [split $value ":"]
    set targethost     [lindex $redirect_list 2]
    set targetport     [lindex $redirect_list 3]
    set newRequestLine [ns_conn request]
    
    Redirect $key $targethost $targetport $newRequestLine
    
    return filter_return
}
proc Redirect { key targethost targetport requestLine } {
    global errorInfo
    # AOLserver team says there is a bug in errorInfo:
    if { ![info exists errorInfo] } {
        # Another Tcl bug workaround.
        set errorInfo ""
    }
    set request_timeout [nsv_get $key timeout]

    if {[catch {
        set fds  [ns_sockopen -timeout $request_timeout $targethost $targetport]
    } err ]} { 
        ns_returnredirect [nsv_get $key errorurl]
        ns_log Error $err
        return filter_return
    }
    set rfds [lindex $fds 0]
    set wfds [lindex $fds 1]
    
    # Following if might be useful if switching to ns_sockopen -nonblock.
    # Probably impossible since lindex will always return at least "":
    if {[llength $wfds] != 1} {
        ns_log Error "Wrong number of wfds"
        ns_returnredirect [nsv_get $key errorurl]
        return filter_return
    }

    #
    # ---- Write request ----
    #
    # write headers. note that we kill off any Connection: 
    # headers and enforce a Connection: Close
    #
    if {[catch {
        set hdrtxt "${requestLine}\r\n"
        set nss [ns_conn headers]
        set l [ns_set size $nss]
        for {set x 0} {$x < $l} {incr x} {
            set k [ns_set key $nss $x]
            if {[string compare -nocase $k "Connection"] == 0} {
                continue;
            }
            append hdrtxt "${k}: [ns_set value $nss $x]\r\n"
        }
        append hdrtxt "Connection: Close\r\n\r\n"
        Debug ">>headers to $targethost:$targetport  /$wfds>>$hdrtxt>>"
        puts -nonewline $wfds $hdrtxt
    
        # Write out the client content data
    
        ns_conncptofp $wfds 
        flush $wfds
    } err ] } {
        ns_log Error "Proxy Failed on Write to Server. $err : [ns_conn request]"
        ns_returnerror 500 "Proxy Failed on Write to Server. $err"
        return filter_return
    }
    # Can't figure out if fconfigure does anything here. Comment out.
    # fconfigure $rfds -translation {binary binary} -encoding binary
    if {[catch {
        ns_writefp $rfds
    } err ] } {
        # ns_log Error "Proxy Failed on Write to Client. $err : [ns_conn request]"
        ns_returnerror 500 "Proxy Failed on Write to Client. $err"
    }
         
    Debug "$targethost:$targetport $rfds/$wfds reply completed"
    
    catch {close $rfds}; close $wfds
    return filter_return
}

Init "your_server" # use the server name from your nsd.tcl file