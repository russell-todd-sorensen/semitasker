# vat.tcl version 0.3 
# Fixed bug: pageroot for blank maps incorrectly set to
# templateroot. 
# Copyright 2000 tom jackson <tom@zmbh.com> Gnu Public License
# Procs used in vat: ######################
proc Notice { s } { ns_log Notice $s }
proc Error  { s } { ns_log Error  $s }

# source the dirlist proc file
source /web/segway/tcl/vat/dirlist.tcl


proc vat_set_url_vars { key } {
    foreach varname [nsv_get $key globalvar] {
	eval vat_set_template_$varname $key
    }
}

proc vat_set_template_server { key } {
    global Template
    set host [string tolower [ns_set iget [ns_conn headers] host]]
    if {[nsv_exists $host servername]} {
	set Template(server) [nsv_get $host servername]
    } else {
	set Template(server) [nsv_get TemplateParameters defaultserver]
	ns_log Debug "Using default server: $Template(server)"
    }
    return
}

proc vat_set_template_version { key } {
    global Template
    set Template(version) current
    return 
}
proc vat_set_template_language { key  } {
    global Template
    set Template(language) en
    return 
}
proc vat_set_template_style { key } {
    global Template
    set Template(style) plain
    return 
}
proc vat_set_template_name { key } {
    global Template
    if { [string index $Template(url) end] == "/" } {
	 set Template(name) index
    } else {
	set Template(name) [file rootname [file tail [ns_conn url]]]
    }
    return
}
proc vat_set_template_module {key } {
    global Template
    set Template(module) [lindex $Template(urlv) 0]
}

proc InitTemplates { servername } {
    ns_log Notice "Initializing Virtual Abstract Templating System"
    set main_config  [ns_configsection "ns/server/${servername}/module/vat"]
    set size         [ns_set size $main_config]
    nsv_set TemplateParameters globalvar      [list]
    nsv_set TemplateParameters method_list     [list]
    for {set i 0 } { $i < $size } {incr i} {
	set key   [string tolower [ns_set   key $main_config $i]]
	set value [ns_set value $main_config $i]
	switch $key {
	    "globalvar" {
		nsv_lappend TemplateParameters globalvar $value
	    }
	    "method"   {
		nsv_lappend TemplateParameters method_list $value
	    }
	    default {
		nsv_set TemplateParameters $key $value
	    }
	}
	
    }
    if {![llength [nsv_get TemplateParameters method_list]] } {
	nsv_set TemplateParameters method_list [list GET POST HEAD]
	ns_log Notice "Setting Template Filter Methods to GET, POST and HEAD"
    } 
    if {![llength [nsv_get TemplateParameters globalvar]]} {
	nsv_set TemplateParameters globalvar [list server version module name]
    }
    if {![nsv_exists TemplateParameters pathvars]} {
	nsv_set TemplateParameters pathvars  [list server version module name]
    }
    foreach var [nsv_get TemplateParameters pathvars] {
	if {[lsearch -exact [nsv_get TemplateParameters globalvar] $var] == -1 } {
	    nsv_lappend TemplateParameters globalvar $var
	}
    }
    ns_log Notice "Global Template Vars: [nsv_get TemplateParameters globalvar]"
    if {![nsv_exists TemplateParameters vhostroot]} {
	nsv_set TemplateParameters vhostroot {[file dirname [ns_info config]]/servers}
    }
    ns_log Notice "Virtual Host Root is '[nsv_get TemplateParameters vhostroot]'"
    if {![nsv_exists TemplateParameters templateroot]} {
	set path_list [list [nsv_get TemplateParameters vhostroot]]
	foreach var [nsv_get TemplateParameters pathvars] {
	    lappend path_list "\$Template($var)"
	}
	set path [join $path_list "/"]
	nsv_set TemplateParameters templateroot $path
    }
    if {![nsv_exists TemplateParameters "breaktrace"]} {
	nsv_set TemplateParameters "breaktrace" 0
    }
    if {![nsv_exists TemplateParameters "pageroot"]} {
	nsv_set TemplateParameters pageroot "[nsv_get TemplateParameters vhostroot]/\${Template(server)}/pages"
	ns_log Notice "Pageroot set to: '[nsv_get TemplateParameters vhostroot]/\${Template(server)}/pages'"
    }
    foreach handler [list default adp tcl html] {
	if {![nsv_exists TemplateParameters ${handler}_handler ]} {
	    nsv_set TemplateParameters ${handler}_handler ${handler}_handler
	    ns_log Notice "Set $handler handler to '${handler}_handler'"
	} else {
	    ns_log Notice "$handler handler proc is: '[nsv_get TemplateParameters ${handler}_handler]'"
	}
    }
    set config_set [ns_configsection "ns/server/${servername}/module/vat/servermap"] 
    set size [ns_set size $config_set]
    for {set i 0 } { $i < $size } {incr i} {
	# Creates map from value of Host header to servername
	set key            [string tolower [ns_set key $config_set $i]]
	set value          [ns_set value $config_set $i]
	ns_log Notice "Mapping host '$key' to server '$value'"
	nsv_set $key servername $value
    }
    # Maps are maps from server to pageroot
    set config_set [ns_configsection "ns/server/${servername}/module/vat/maps"] 
    set size [ns_set size $config_set]
    for {set i 0 } { $i < $size } {incr i} {
	
	set key            [string tolower [ns_set   key $config_set $i]]
	set value          [ns_set value $config_set $i]
	set key_list       [split   $key ":"]
	set method         [lindex $key_list 0]
	set server         [lindex $key_list 1]

	set filter_methods $method
	Notice "Processing $key"	
	if { [string compare "*" "$method"  ] } { 
	    set filter_methods [list $method]
	} else {
	    set filter_methods [nsv_get TemplateParameters method_list]
	}
	switch -glob $value {
	    "" {
		# Pageroot?
		set value [nsv_get TemplateParameters pageroot]
	    }
	    "/*" {
		# do nothing, absolute path value == value
	    }
	    default {
		# prepend pageroot
		set value [ns_info pageroot]/$value
	    }
	}
	
	foreach m $filter_methods {
	    set key   ${m}:${server}
	    Notice "$key --> $value"
	    nsv_array set $key [nsv_array get TemplateParameters]
	    # was templateroot, changed to pageroot.
	    nsv_set $key pageroot $value
	}
    }
    if {![nsv_exists TemplateParameters filters_on]} {

	foreach op [nsv_get TemplateParameters method_list] {
	    ns_register_filter preauth $op /* SetConn
	    Notice "!!! ns_register_filter preauth  $op /* SetConn"
	}  
	# Now for some reason reg-ing one method gets all here:
	ns_register_filter postauth GET /* vhost_abstract_templates 
	Notice "!!! ns_register_filter postauth GET /* vhost_abstract_templates"
	ns_register_filter postauth POST /* vhost_abstract_templates 
	Notice "!!! ns_register_filter postauth POST /* vhost_abstract_templates"
	ns_register_filter postauth HEAD /* vhost_abstract_templates 
	Notice "!!! ns_register_filter postauth HEAD /* vhost_abstract_templates"
	
	nsv_set TemplateParameters filters_on 1
	Notice "Finished Registering Template Filters."
    }
    ns_log Notice "Finished Initializing Virtual Abstract Templating System"
}
proc SetConn { context } {

    global Template

    set Template(break)  0
    set Template(host)   [string tolower [ns_set iget [ns_conn headers] host]]
    if {[ns_conn driver] == "nsssl" } {
	set Template(protocol) "https"
    } else {
	set Template(protocol) "http"
    }
    ns_log Debug "Template(host) set to $Template(host)"
    if {![nsv_array exists $Template(host) ]} {
	# Host not setup for VAT
	# ns_log Error "Array $Template(host) not setup"
	set Template(break) 1
	return filter_ok
    }
    set Template(server) [nsv_get $Template(host) servername]
    set Template(method) [ns_conn method]
    set Template(key)    $Template(method):$Template(server)
    if {![nsv_array exists $Template(key)]} {
	# Method:server not setup for VAT:
	# ns_log Error "$Template(key) nor setup for VAT"
	set Template(break) 1
	return filter_ok
    }
    set Template(urlv)   [ns_conn urlv]
    set Template(url)    [ns_conn url]
    # Set a few path vars:
    vat_set_url_vars     $Template(key)
    set Template(path)   [subst [nsv_get $Template(key) templateroot] ]

    set Template(pageroot) [subst [nsv_get $Template(key) pageroot] ]
    ns_log Debug "Pageroot for: $Template(key) set to $Template(pageroot)"

    return filter_ok
}

# Filter for abstract urls

proc vhost_abstract_templates { context } {
    
    global Template
    ns_log Debug "Method is [ns_conn method]"
    if {![info exists Template(break)] || $Template(break)} {
	# Host not setup for VAT
	ns_log Debug "Template break"
	return filter_ok
    }

    # See if abstract file exists in pageroot for this server:
    set full_url $Template(pageroot)$Template(url)
    if {[vat_handle_abstract_urls $full_url]} {

	return filter_return
    }

    if {![file isdirectory $Template(path)] } {

	ns_log Debug "No path: $Template(path)" 
	# exp was filter_ok
	return filter_ok

    }

    # Template Directory Exists, look for templates
    ns_log Debug "Found $Template(path)"
    if {[vat_parse_templates]} {
	return filter_return
    } 
 
    # No Templates in path go on to next filter:
    ns_log Debug "Didn't find anything in $Template(path)"
    return filter_ok
}
proc vat_parse_templates { } {
    uplevel {
	global Template
	
	# first make a list of files to parse
	# if count files is 0 return 0
	regsub -all {[^-:,0-9a-zA-Z_/.]} $Template(path)/$Template(name) {\\&} file_glob
	set file_list [lsort [glob -nocomplain "${file_glob}-??.*"]]
	if {![llength $file_list]} {
	    return 0
	}
	
	# File Count > 0
	ns_log Debug "Found files: $file_list"
	ns_log Debug "Match ${file_glob}-??.*"
	ns_log Debug "$Template(name)"
	foreach template_file $file_list {
	   
	    switch -glob $template_file {
		"*.adp" - "*.html" {
		    ns_write [ns_adp_parse -file $template_file ]
		}
		"*.tcl" {
		    source $template_file
		}
		default {
		    if {[llength $file_list] == 1 } {
			ns_returnfile 200 [ns_guesstype $file] $file 
		    } else {
			set file [open $template_file r]
			ns_writefp $file
			close $file	
		    }
		}
	    }
	    
	}
    }
    ns_conn close
    return 1
}
proc vat_handle_abstract_urls { url } {

    set actual_filename [vat_find_matching_file $url]
    if {[string match $actual_filename "NOFILE"]} {
	return 0
    } elseif {[vat_eval_registered_handler $actual_filename]} {
	return 1
    }
    return 0

}
proc vat_find_matching_file { full_url } {

    global Template
    
    ns_log Debug "url is: $full_url"
    regsub -all {[^0-9a-zA-Z_/.-]} $full_url {\\&} path_glob
    if {[file isdirectory $full_url ]} {
	
	# If stolen and adapted from aD's rp_abstract_url_server by jsalz@arsdigita.com
        if { [string index $full_url end] != "/" } {
	    set url "$Template(url)/"
	    if { [ns_conn query] != "" } {
		append url "?[ns_conn query]"
	    }
	    ns_returnredirect $url
	    return filter_return
	}
        set original_url $full_url
	set abstract_url "[string trimright $path_glob /]/index"
	set full_url     "[string trimright $full_url  /]/index"
        # New section to shell out directory contents
        set files [glob -nocomplain "$abstract_url.*"]

    	if {[llength $files ] > 0 } {
	  set precedence [nsv_get $Template(key) precedence]
	  foreach extension $precedence {
	    set file "${abstract_url}.$extension"
            if { [lsearch $files $file] != -1 } {
		return "${full_url}.$extension"
	    }
	  }
        } else {
          # We need to return the content of the directory.
          return $original_url

        }
    } elseif { [file exists $full_url] } {

	return $full_url
    } else {
	set abstract_url [file rootname $path_glob]
	set full_url     [file rootname $full_url ]
    }
    set files [glob -nocomplain "$abstract_url.*"]

    if {[llength $files ] > 0 } {
	set precedence [nsv_get $Template(key) precedence]
	foreach extension $precedence {
	    set file "${abstract_url}.$extension"
            if { [lsearch $files $file] != -1 } {
		return "${full_url}.$extension"
	    }
	}
    } 
    return "NOFILE"
}
proc vat_eval_registered_handler {filename} {

    global Template

    set extension [string trimleft [file extension $filename] .]

    if {[nsv_exists "$Template(key)"  "${extension}_handler" ]} {
	eval [nsv_get $Template(key) ${extension}_handler ] $filename
    } else {
	# Use default handler
	eval [nsv_get $Template(key) default_handler] $filename
    }
    return 1

}
proc vat_default_handler {filename} {
    ns_log Debug "Using default_handler on: $filename "
    if {[file isdirectory $filename]} {
	# return the contents formatted
        ns_return 200 text/html "[vat_dirlist $filename]"
    } else {
        ns_returnfile 200 [ns_guesstype $filename] $filename
    }
    return 1
}
proc vat_adp_handler {filename} {
    ns_log Debug "Using adp_handler on: $filename"
    set adp [ns_adp_parse -file $filename]
    set content_type [ns_set iget [ns_conn outputheaders] "content-type"]
    if { $content_type == "" } {
	set content_type "text/html"
    }
    ns_return 200 $content_type $adp	
    return 1  
}
proc vat_tcl_handler {filename} {
    ns_log Debug "Using tcl_handler on: $filename"
    source $filename
    return 1
}

# following is used for getting the correct redirect
rename ns_conn ns_conn_new
proc ns_conn { args } {
   if {[string match [lindex $args 0] "location"]} {
      global Template
       if {[info exists Template(host)]} {
	   return http://${Template(host)}
       } else {
	   return [ns_conn_new location]
       }
   } else {
       return [eval "ns_conn_new $args"]
   }
}

rename ns_returnredirect ns_returnredirect_new

proc ns_returnredirect { arg } {
    ns_log Debug "arg is $arg"
    ns_log Debug "ns_conn url is [ns_conn url]"
    if {[string match -nocase "http*" $arg]} {
	ns_returnredirect_new $arg
    } elseif {[string match -nocase "/*" $arg]}  {
	global Template
	ns_log Debug "Redirecting to ${Template(protocol)}://${Template(host)}$arg"
	ns_returnredirect_new ${Template(protocol)}://${Template(host)}$arg
    } else {
	global Template 
	set full_url [ns_normalizepath [file dirname [ns_conn url]]/${arg}]
	ns_log Debug "full_url is $full_url"
	ns_log Debug "Redirecting to ${Template(protocol)}://${Template(host)}$arg"
	ns_returnredirect_new ${Template(protocol)}://${Template(host)}$full_url
    }
    return
}

InitTemplates segway

# Following procs are for use with OpenACS (VirtualACS)
# You can comment these out if you do not have multiple
# ACS installations running from the same AOLserver.

rename ns_info ns_info_old


proc server_name_for_connection { } {
    global Template
    if {[info exists Template(server)]} {
	return $Template(server)
    } else {
	# Not in connection Thread
	return [nsv_get TemplateParameters defaultserver]
    }
}

proc ns_info { option } {
    switch $option {
	server {
	    return [server_name_for_connection]
	}
	default {
	    return [ns_info_old $option]	
	}
    }
}
