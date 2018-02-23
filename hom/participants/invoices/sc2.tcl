set url [ns_conn url]
set splitUrl [split $url /]
set requestedFile [lindex $splitUrl end]
set urlDirectory [join [lrange $splitUrl 0 end-1] /] 
set directory [ns_normalizepath $urlDirectory]/
set pageroot [ns_info pageroot]
set absolutePath [file join $pageroot [string trimleft $directory /]]/

source [file join $absolutePath load-customers.tcl]

set invoiceLines [list]

set invoiceHeader1 [split [string map {\t ,} "!HDR	PROD	VER	REL	IIFVER	DATE	TIME	ACCNTNT	ACCNTNTSPLITTIME"] ,]									
set invoiceHeader2 [split [string map {\t ,} "HDR	QuickBooks Desktop Pro	Version 27.0D	Release R5P	1	2017-07-29	1501191278	N	0"] ,]								
set invoiceHeader3 [split [string map {\t ,} "!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT	NAMEISTAXABLE	ADDR1	ADDR3	TERMS	SHIPVIA	SHIPDATE"] ,]
set invoiceHeader4 [split [string map {\t ,} "!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY	PRICE	INVITEM	TAXABLE	OTHER2	YEARTODATE	WAGEBASE"] ,]
set invoiceHeader5 [split [string map {\t ,} "!ENDTRNS"] ,]

set customerHeaderList [split [string map {\t ,} "!CUST	NAME	REFNUM	TIMESTAMP	BADDR1	BADDR2	BADDR3	BADDR4	BADDR5	SADDR1	SADDR2	SADDR3	SADDR4	SADDR5	PHONE1	PHONE2	FAXNUM	EMAIL	NOTE	CONT1	CONT2	CTYPE	TERMS	TAXABLE	SALESTAXCODE	LIMIT	RESALENUM	REP	TAXITEM	NOTEPAD	SALUTATION	COMPANYNAME	FIRSTNAME	MIDINIT	LASTNAME	CUSTFLD1	CUSTFLD2	CUSTFLD3	CUSTFLD4	CUSTFLD5	CUSTFLD6	CUSTFLD7	CUSTFLD8	CUSTFLD9	CUSTFLD10	CUSTFLD11	CUSTFLD12	CUSTFLD13	CUSTFLD14	CUSTFLD15	JOBDESC	JOBTYPE	JOBSTATUS	JOBSTART	JOBPROJEND	JOBEND	HIDDEN	DELCOUNT	PRICELEVEL"] ,]

set form [ns_conn form]

foreach field $customerHeaderList {
	lappend customerFields $field
	if {"$field" eq "!CUST"} {
		set customerFieldValue(field_!CUST) [ns_set get $form CUST ""]
	} else {
		set customerFieldValue(field_$field) [ns_set get $form field_$field ""]
	}
}

set javascriptData "
var customerData = new Array();\n"

foreach customerName [lsort [array names TYPE-CUST]] {
	set customerNameEscape [string map {' &apos;} $customerName]
	lappend customerOptionList "  <option value='$customerNameEscape'>$customerName</option>"
	append javascriptData "customerData\['$customerName'\] = \{\n"
	foreach field $customerFields fieldValue [string map {' \\'} [set TYPE-CUST($customerName)]] {
		append javascriptData " 'field_$field': '$fieldValue',\n"
	}
	append javascriptData "\};\n"
}

set newCustomerLine [list]

foreach customerField $customerFields {
	if {"$customerField" eq "!CUST"} {
		lappend newCustomerLine $customerFieldValue(field_!CUST)
	} else {
		lappend newCustomerLine "\"[string map {{"} {}} $customerFieldValue(field_$customerField)]\""
	}
}

lappend invoiceLines [join $invoiceHeader1 \t] [join $invoiceHeader2 \t] [join $invoiceHeader3 \t] [join $invoiceHeader4 \t]  [join $invoiceHeader5 \t]
lappend invoiceLines [join $customerHeaderList \t]
lappend invoiceLines [join $newCustomerLine \t]
set filename [string map {* - ? _ ' - \" _} $customerFieldValue(field_NAME)]
set path [file join $absolutePath $filename.IIF]
ns_log Notice "PATH=$path"
set custFd [open $path w+]

puts -nonewline $custFd [join $invoiceLines \n]

close $custFd

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
</head>
<body>
<pre>
[join $invoiceLines \n]
</pre>
<a href='./$filename.IIF'>$filename</a>
</body>
</html>"
