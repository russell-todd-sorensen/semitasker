set url [ns_conn url]
set splitUrl [split $url /]
set requestedFile [lindex $splitUrl end]
set urlDirectory [join [lrange $splitUrl 0 end-1] /] 
set directory [ns_normalizepath $urlDirectory]/
set pageroot [ns_info pageroot]
set absolutePath [file join $pageroot [string trimleft $directory /]]/

source [file join $absolutePath load-customers.tcl]

set data ""
set arriveField "CUSTFLD1"
set endField    "CUSTFLD2"
set companyField "COMPANYNAME"
set houseField  "CUSTFLD5"
set dobField    "CUSTFLD7"
set docField    "CUSTFLD6"
set ccoField    "CUSTFLD8"
set sotpField   "CUSTFLD9"
set firstNameField "FIRSTNAME"
set lastNameField "LASTNAME"
set ctypeField  "CTYPEX"
set termsField  "TERMSX"
set emailField  "EMAIL"
set addrNameField "BADDR1"
set refnumField "REFNUM"
set nameField   "NAME"
set jobtypeField "JOBTYPEX"
set typeField   "!CUST"
set pricelevelField "PRICELEVELX"

set invoiceLines [list]

set invoiceHeader(1) [split [string map {\t ,} "!HDR	PROD	VER	REL	IIFVER	DATE	TIME	ACCNTNT	ACCNTNTSPLITTIME"] ,]									
set invoiceHeader(2) [split [string map {\t ,} "HDR	QuickBooks Desktop Pro	Version 27.0D	Release R5P	1	2017-07-29	1501191278	N	0"] ,]								
set invoiceHeader(3) [split [string map {\t ,} "!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT	NAMEISTAXABLE	ADDR1	ADDR3	TERMS	SHIPVIA	SHIPDATE"] ,]
set invoiceHeader(4) [split [string map {\t ,} "!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY	PRICE	INVITEM	TAXABLE	OTHER2	YEARTODATE	WAGEBASE"] ,]
set invoiceHeader(5) [split [string map {\t ,} "!ENDTRNS"] ,]

set customerHeaderList [split [string map {\t ,} "!CUST	NAME	REFNUM	TIMESTAMP	BADDR1	BADDR2	BADDR3	BADDR4	BADDR5	SADDR1	SADDR2	SADDR3	SADDR4	SADDR5	PHONE1	PHONE2	FAXNUM	EMAIL	NOTE	CONT1	CONT2	CTYPE	TERMS	TAXABLE	SALESTAXCODE	LIMIT	RESALENUM	REP	TAXITEM	NOTEPAD	SALUTATION	COMPANYNAME	FIRSTNAME	MIDINIT	LASTNAME	CUSTFLD1	CUSTFLD2	CUSTFLD3	CUSTFLD4	CUSTFLD5	CUSTFLD6	CUSTFLD7	CUSTFLD8	CUSTFLD9	CUSTFLD10	CUSTFLD11	CUSTFLD12	CUSTFLD13	CUSTFLD14	CUSTFLD15	JOBDESC	JOBTYPE	JOBSTATUS	JOBSTART	JOBPROJEND	JOBEND	HIDDEN	DELCOUNT	PRICELEVEL"] ,]

foreach field $customerHeaderList {
	lappend customerFields $field
}

set javascriptData "
var customerData = new Array();\n";

foreach customerName [lsort [array names TYPE-CUST]] {
	set customerNameEscape [string map {' &apos;} $customerName]
	lappend customerOptionList "  <option value='$customerNameEscape'>$customerName</option>"
	append javascriptData "customerData\['$customerName'\] = \{\n"
	foreach field $customerFields fieldValue [string map {' \\'} [set TYPE-CUST($customerName)]] {
		append javascriptData " 'field_$field': '$fieldValue',\n"
	}
	append javascriptData "\};\n"
}

lappend invoiceLines $invoiceHeader(1) $invoiceHeader(2) $invoiceHeader(3) $invoiceHeader(4) $invoiceHeader(5)


set form "<form id='form1' name='form1'>"

foreach field $customerFields {
	if {"$field" eq "NAME"} {
		lappend formFields "  <li><label for='field_$field'>$field</label>
  <select id='field_NAME' name='field_NAME' onchange='getCustomer(\"field_NAME\")'>
  [join $customerOptionList \n]
  </select>
  </li>"
		
	} elseif {"$field" eq "!CUST"}  {
		continue
	} else {
		lappend formFields "<li><label for='field_$field'>$field</label><input id='field_$field' name='field_$field' type='text'></li>\n"
	}
}

append form "[join $formFields \n]\n</form>\n"

set output [writeCustomer "Matthew -- Sorensen, Russell" invoiceHeader customerHeaderList TYPE-CUST]

set fdOut [open [file join $absolutePath "test-file.iif"] w+]
puts -nonewline $fdOut $output
close $fdOut

ns_return 200 text/html "<!DOCTYPE html>
<html lang='en_US'>
<head>
<meta name='lang' value='UTF-8'/>

<link rel='stylesheet' type='text/css' media='all' href='/css/reset.css'>

<link rel='stylesheet' media='all' href='/css/log.css'>
<link rel='stylesheet' media='all' href='/js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.all.css'>
<link rel='stylesheet' media='all' href='/css/logo-maker-1.css'>
<link rel='stylesheet' media='all' href='/css/green-form.css' >
<link rel='stylesheet' media='all' href='https://file.myfontastic.com/xXW5U9UCxPBxcUuaZGbBJP/icons.css'>
<script type='text/javascript' src='/js/d3.v4.js'></script>
<script type='text/javascript' src='/js/jquery-1.7.1.js'></script>
<script type='text/javascript' src='/js/jQuery.UI.Combined.1.8.20.1/Content/Scripts/jquery-ui-1.8.20.js'></script>
<script type='text/javascript' src='/js/log-2.js'></script>
<script type='text/javascript' src='/js/data.js'></script>
<script type='text/javascript' src='/js/form-save-restore.js'></script>
<script type='text/javascript' src='/js/binary-hex-conversions.js'></script>
<script type='text/javascript' src='/js/example-library.js'></script>
<script type='text/javascript' src='/js/svg-transform.js'></script>
<script >

var customerFields =\['[join $customerFields ',']'\];
</script>
<script src='select-customer.js'></script>
<style>
#customers {
    border: 1px solid black;
    border-collapse: collapse;

}


#form1 li {
	width: 450px;
	list-style: none;
	border-top: 1px solid black;
	border-left:1px solid black;
	border-right:1px solid black;
	padding-bottom: 1px;
}
#form1 li:nth-of-type(odd) {
	background-color: #ccc;
	}

#form1 label {
    display: inline-block;
	width: 150px;
	font-family: sans-serif;
	line-height: 1.3em;
	margin-top: 2px;
	margin-bottom: 0;
	margin-left: 2px;
	}
#form1 input\[type=\"text\" i\] {
    width: 290px;
    vertical-align: central;
    }
</style>
</head>
<body>
$form

<script>
$javascriptData
</script>
</body>
</html>"


