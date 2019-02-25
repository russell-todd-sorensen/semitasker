
set data "nothing"
if {[catch {exec tclsh85t.exe c:/my-naviserver/tcl/cmdline/zip-data-and-images.tcl } result options]} {

	set data "$result [array get options]"
	
}
set pwd [pwd]
ns_return 200 text/plain "pwd=$pwd\n$data"