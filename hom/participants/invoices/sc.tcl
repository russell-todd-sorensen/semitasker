set url [ns_conn url]
set splitUrl [split $url /]
set requestedFile [lindex $splitUrl end]
set urlDirectory [join [lrange $splitUrl 0 end-1] /] 
set directory [ns_normalizepath $urlDirectory]/
set pageroot [ns_info pageroot]
set absolutePath [file join $pageroot [string trimleft $directory /]]/

#source [file join $absolutePath load-customers.tcl]
source [file join $absolutePath load-customers.tcl]

proc createSelect {fieldName} {
	upvar "TYPE-$fieldName" arrayName
	set selectHtml " <select id='field_$fieldName' name='field_$fieldName'>"
	lappend selectOptions "  <option value='' selected='selected'>No Value</option>"
	set javascriptArray "dataArray\['TYPE-$fieldName'\] = new Array();\n"
	foreach name [lsort [array names arrayName]] {
		lappend selectOptions "  <option value='$name'>$name</option>"
		append javascriptArray "dataArray\['TYPE-$fieldName'\]\['$name'\] = '[string map {' \\'} $name]';\n"
	}
	append selectHtml [join $selectOptions \n]
	append selectHtml " </select>
<script>
$javascriptArray
</script>\n"
	
	return $selectHtml
}

set invoiceLines [list]

set invoiceHeader1 [split [string map {\t ,} "!HDR	PROD	VER	REL	IIFVER	DATE	TIME	ACCNTNT	ACCNTNTSPLITTIME"] ,]									
set invoiceHeader2 [split [string map {\t ,} "HDR	QuickBooks Desktop Pro	Version 27.0D	Release R5P	1	2017-07-29	1501191278	N	0"] ,]								
set invoiceHeader3 [split [string map {\t ,} "!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT	NAMEISTAXABLE	ADDR1	ADDR3	TERMS	SHIPVIA	SHIPDATE"] ,]
set invoiceHeader4 [split [string map {\t ,} "!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY	PRICE	INVITEM	TAXABLE	OTHER2	YEARTODATE	WAGEBASE"] ,]
set invoiceHeader5 [split [string map {\t ,} "!ENDTRNS"] ,]

set customerHeaderList [split [string map {\t ,} "!CUST	NAME	REFNUM	TIMESTAMP	BADDR1	BADDR2	BADDR3	BADDR4	BADDR5	SADDR1	SADDR2	SADDR3	SADDR4	SADDR5	PHONE1	PHONE2	FAXNUM	EMAIL	NOTE	CONT1	CONT2	CTYPE	TERMS	TAXABLE	SALESTAXCODE	LIMIT	RESALENUM	REP	TAXITEM	NOTEPAD	SALUTATION	COMPANYNAME	FIRSTNAME	MIDINIT	LASTNAME	CUSTFLD1	CUSTFLD2	CUSTFLD3	CUSTFLD4	CUSTFLD5	CUSTFLD6	CUSTFLD7	CUSTFLD8	CUSTFLD9	CUSTFLD10	CUSTFLD11	CUSTFLD12	CUSTFLD13	CUSTFLD14	CUSTFLD15	JOBDESC	JOBTYPE	JOBSTATUS	JOBSTART	JOBPROJEND	JOBEND	HIDDEN	DELCOUNT	PRICELEVEL"] ,]

foreach field $customerHeaderList {
	lappend customerFields $field
}

set javascriptData "
var customerData = new Array();\n"
set logMsg ""

foreach customerName [lsort [array names TYPE-CUST]] {
	set customerNameEscape [string map {' &apos;} $customerName]
	if {"$customerName" eq "Matthew -- Sorensen, Russell"} {
		set log 1
	} else {
		set log 0
	}
	lappend customerOptionList "  <option value='$customerNameEscape'>$customerName</option>"
	append javascriptData "customerData\['$customerName'\] = \{\n"
	if {$log} {
		append logMsg "fields: $customerFields\n"
		append logMsg "values: [set TYPE-CUST($customerName)]"
	}
	foreach field $customerFields fieldValue [string map {' \\'} [set TYPE-CUST($customerName)]] {
		append javascriptData " 'field_$field': '$fieldValue',\n"

	}
	append javascriptData "\};\n"
}

ns_log Notice "CUSTOMER RUSS: '$logMsg'"

lappend invoiceLines $invoiceHeader1 $invoiceHeader2 $invoiceHeader3 $invoiceHeader4 $invoiceHeader5


set form "<form id='form1' name='form1' action='sc2.tcl'>
 <input type='hidden' name='CUST' value='CUST'>
 <fieldset id='formfields1'>
   <legend>Customer Data</legend>
  <ul>"

foreach field $customerFields {
	set fieldLabel $field
	if {[regexp {(CUSTFLD)([0-9]+)} $field all dummy fieldIndex]} {
		set fieldIndex [expr {$fieldIndex - 1}]
		foreach cfield $nameList(TYPE-CUSTNAMEDICT) cvalue [set TYPE-CUSTNAMEDICT($fieldIndex)] {
			if {"$cfield" eq "LABEL"} {
				if {"$cvalue" ne ""} {
					set fieldLabel $cvalue
					break
				}
			}
		}
	}
	if {"$field" eq "NAME"} {
		lappend formFields "  <li><label for='field_NAME'>Customer Name</label>
  <select id='field_NAME' name='field_NAME' onchange='getCustomer(\"field_NAME\")'>
  [join $customerOptionList \n]
  </select>
  </li>"
  	} elseif {[array exists "TYPE-$field"]} {
		lappend formFields "<li><label for='field_$field'>$fieldLabel</label>\n[createSelect $field]</li>"
	} elseif {"$field" eq "!CUST"}  {
		continue
	} else {
		lappend formFields "<li><label for='field_$field'>$fieldLabel</label><input id='field_$field' name='field_$field' type='text'></li>\n"
	}
}

lappend formFields "<li><label for='submit'>Submit</label><input type='submit'></li>"

append form "[join $formFields \n]
  </ul>
 </fieldset>
</form>\n"
foreach arrayNode [lsort -integer [array names TYPE-CUSTNAMEDICT]] {
	
	ns_log Notice "$arrayNode = [set TYPE-CUSTNAMEDICT($arrayNode)]"
}
ns_return 200 text/html "<!DOCTYPE html>
<html lang='en-US'>
<head>
<meta name='lang' value='UTF-8'/>

<link rel='stylesheet' type='text/css' media='all' href='/css/reset.css'>

<link rel='stylesheet' media='all' href='/css/log.css'>
<link rel='stylesheet' media='all' href='/js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.all.css'>
<link rel='stylesheet' media='all' href='/css/logo-maker-1.css'>
<link rel='stylesheet' media='all' href='/css/green-form.css'>
<script type='text/javascript' src='/js/d3.v4.js'></script>
<script type='text/javascript' src='/js/jquery-1.7.1.js'></script>
<script type='text/javascript' src='/js/jQuery.UI.Combined.1.8.20.1/Content/Scripts/jquery-ui-1.8.20.js'></script>
<script type='text/javascript' src='/js/log-2.js'></script>
<script type='text/javascript' src='/js/data.js'></script>
<script type='text/javascript' src='/js/form-save-restore.js'></script>
<script type='text/javascript' src='/js/binary-hex-conversions.js'></script>
<script type='text/javascript' src='/js/example-library.js'></script>
<script type='text/javascript' src='/js/svg-transform.js'></script>
<script type='text/javascript' src='sc.js'></script>
<script >

var customerFields =\['[join $customerFields ',']'\];
var dataArray = new Array();
</script>
<script src='select-customer.js'></script>
<style>
#customers {
    border: 1px solid black;
    border-collapse: collapse;

}

select,
select option,
#field_NAME,
#form1 #field_NAME option {
	font-family: sans serif;
	font-size: 15px;
	width: 280px;
}


#form1 {
	margin-left: 5px;
	margin-top: 5px;
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

#form1 li:nth-of-type(even) {
	background-color: #eee;
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

fieldset {
	border: 1px solid darkolivegreen;
	width: 495px;
}

legend {
	background-color: tan;
	margin: 3px;
}

</style>
</head>
<body>

$form

<script>
$javascriptData

\$(document).ready(function() {
    Log.Remove();
});
</script>
</body>
</html>"


