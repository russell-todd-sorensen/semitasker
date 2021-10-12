if {[llength [info command ns_log]] ==0} {
	proc ns_log {level message} {
		puts stdout "${level}: $message"
	}
	proc ns_return {code type message} {
		puts stdout "$code $type $message"
	}
}

set args {

    	{a 1} 
    	{b 2}	
    	{c 3}	

	}

set procName abc

if {[llength [info proc $procName]] == 1} {
    rename $procName ""
}
set body {
	set result ""
	append result "$a"
	append result "$b"
	append result "$c"
}
ns_log Notice "body='$body'"
ns_log Notice "args='$args'"

proc makeproc {name arguments body} {
    proc $name $arguments $body
}

if {[catch {
    makeproc $procName $args $body

    ns_log Notice "info body $procName= [info body $procName]"
    ns_log Notice "info args $procName= [info args $procName]"
    set result [$procName 1 2 3]
    set code 200
} err]} {
    set code 200
    global errorInfo
    set result "the Error is '$errorInfo'"
}

ns_return $code text/plain $result