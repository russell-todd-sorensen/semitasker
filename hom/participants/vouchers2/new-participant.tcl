<!DOCTYPE html>
<html lang='en_US'>
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
<script >

var customerFields =['!CUST','NAME','REFNUM','TIMESTAMP','BADDR1','BADDR2','BADDR3','BADDR4','BADDR5','SADDR1','SADDR2','SADDR3','SADDR4','SADDR5','PHONE1','PHONE2','FAXNUM','EMAIL','NOTE','CONT1','CONT2','CTYPE','TERMS','TAXABLE','SALESTAXCODE','LIMIT','RESALENUM','REP','TAXITEM','NOTEPAD','SALUTATION','COMPANYNAME','FIRSTNAME','MIDINIT','LASTNAME','CUSTFLD1','CUSTFLD2','CUSTFLD3','CUSTFLD4','CUSTFLD5','CUSTFLD6','CUSTFLD7','CUSTFLD8','CUSTFLD9','CUSTFLD10','CUSTFLD11','CUSTFLD12','CUSTFLD13','CUSTFLD14','CUSTFLD15','JOBDESC','JOBTYPE','JOBSTATUS','JOBSTART','JOBPROJEND','JOBEND','HIDDEN','DELCOUNT','PRICELEVEL'];
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

#form1 input[type="text" i] {
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

<form id='form1' name='form1' action='select-customer-2.tcl'>
 <input type='hidden' name='CUST' value='CUST'>
 <fieldset id='formfields1'>
   <legend>Customer Data</legend>
  <ul>  <li><label for='field_NAME'>Customer Name</label>
  <select id='field_NAME' name='field_NAME' onchange='getCustomer("field_NAME")'>
  
   </select>
  </li>
<li><label for='field_REFNUM'>REFNUM</label><input id='field_REFNUM' name='field_REFNUM' type='text'></li>

<li><label for='field_TIMESTAMP'>TIMESTAMP</label><input id='field_TIMESTAMP' name='field_TIMESTAMP' type='text'></li>

<li><label for='field_BADDR1'>BADDR1</label><input id='field_BADDR1' name='field_BADDR1' type='text'></li>

<li><label for='field_BADDR2'>BADDR2</label><input id='field_BADDR2' name='field_BADDR2' type='text'></li>

<li><label for='field_BADDR3'>BADDR3</label><input id='field_BADDR3' name='field_BADDR3' type='text'></li>

<li><label for='field_BADDR4'>BADDR4</label><input id='field_BADDR4' name='field_BADDR4' type='text'></li>

<li><label for='field_BADDR5'>BADDR5</label><input id='field_BADDR5' name='field_BADDR5' type='text'></li>

<li><label for='field_SADDR1'>SADDR1</label><input id='field_SADDR1' name='field_SADDR1' type='text'></li>

<li><label for='field_SADDR2'>SADDR2</label><input id='field_SADDR2' name='field_SADDR2' type='text'></li>

<li><label for='field_SADDR3'>SADDR3</label><input id='field_SADDR3' name='field_SADDR3' type='text'></li>

<li><label for='field_SADDR4'>SADDR4</label><input id='field_SADDR4' name='field_SADDR4' type='text'></li>

<li><label for='field_SADDR5'>SADDR5</label><input id='field_SADDR5' name='field_SADDR5' type='text'></li>

<li><label for='field_PHONE1'>PHONE1</label><input id='field_PHONE1' name='field_PHONE1' type='text'></li>

<li><label for='field_PHONE2'>PHONE2</label><input id='field_PHONE2' name='field_PHONE2' type='text'></li>

<li><label for='field_FAXNUM'>FAXNUM</label><input id='field_FAXNUM' name='field_FAXNUM' type='text'></li>

<li><label for='field_EMAIL'>EMAIL</label><input id='field_EMAIL' name='field_EMAIL' type='text'></li>

<li><label for='field_NOTE'>NOTE</label><input id='field_NOTE' name='field_NOTE' type='text'></li>

<li><label for='field_CONT1'>CONT1</label><input id='field_CONT1' name='field_CONT1' type='text'></li>

<li><label for='field_CONT2'>CONT2</label><input id='field_CONT2' name='field_CONT2' type='text'></li>

<li><label for='field_CTYPE'>CTYPE</label>
 <select id='field_CTYPE' name='field_CTYPE'>  <option value='' selected='selected'>No Value</option>
  <option value='Active'>Active</option>
  <option value='Assistant House Leader'>Assistant House Leader</option>
  <option value='House Leader'>House Leader</option>
  <option value='Inactive'>Inactive</option>
  <option value='Left Program'>Left Program</option>
  <option value='Non Transitional Housing'>Non Transitional Housing</option>
  <option value='Pending New Arrivals'>Pending New Arrivals</option>
  <option value='Program Participant'>Program Participant</option>
  <option value='Terminated'>Terminated</option> </select>
<script>
dataArray['TYPE-CTYPE'] = new Array();
dataArray['TYPE-CTYPE']['Active'] = 'Active';
dataArray['TYPE-CTYPE']['Assistant House Leader'] = 'Assistant House Leader';
dataArray['TYPE-CTYPE']['House Leader'] = 'House Leader';
dataArray['TYPE-CTYPE']['Inactive'] = 'Inactive';
dataArray['TYPE-CTYPE']['Left Program'] = 'Left Program';
dataArray['TYPE-CTYPE']['Non Transitional Housing'] = 'Non Transitional Housing';
dataArray['TYPE-CTYPE']['Pending New Arrivals'] = 'Pending New Arrivals';
dataArray['TYPE-CTYPE']['Program Participant'] = 'Program Participant';
dataArray['TYPE-CTYPE']['Terminated'] = 'Terminated';

</script>
</li>
<li><label for='field_TERMS'>TERMS</label>
 <select id='field_TERMS' name='field_TERMS'>  <option value='' selected='selected'>No Value</option>
  <option value='Due by the 1st of Mo'>Due by the 1st of Mo</option>
  <option value='Due by the 1st of Month'>Due by the 1st of Month</option>
  <option value='Due by the 5th of month'>Due by the 5th of month</option>
  <option value='Due on receipt'>Due on receipt</option>
  <option value='Net 30'>Net 30</option> </select>
<script>
dataArray['TYPE-TERMS'] = new Array();
dataArray['TYPE-TERMS']['Due by the 1st of Mo'] = 'Due by the 1st of Mo';
dataArray['TYPE-TERMS']['Due by the 1st of Month'] = 'Due by the 1st of Month';
dataArray['TYPE-TERMS']['Due by the 5th of month'] = 'Due by the 5th of month';
dataArray['TYPE-TERMS']['Due on receipt'] = 'Due on receipt';
dataArray['TYPE-TERMS']['Net 30'] = 'Net 30';

</script>
</li>
<li><label for='field_TAXABLE'>TAXABLE</label><input id='field_TAXABLE' name='field_TAXABLE' type='text'></li>

<li><label for='field_SALESTAXCODE'>SALESTAXCODE</label><input id='field_SALESTAXCODE' name='field_SALESTAXCODE' type='text'></li>

<li><label for='field_LIMIT'>LIMIT</label><input id='field_LIMIT' name='field_LIMIT' type='text'></li>

<li><label for='field_RESALENUM'>RESALENUM</label><input id='field_RESALENUM' name='field_RESALENUM' type='text'></li>

<li><label for='field_REP'>REP</label><input id='field_REP' name='field_REP' type='text'></li>

<li><label for='field_TAXITEM'>TAXITEM</label><input id='field_TAXITEM' name='field_TAXITEM' type='text'></li>

<li><label for='field_NOTEPAD'>NOTEPAD</label><input id='field_NOTEPAD' name='field_NOTEPAD' type='text'></li>

<li><label for='field_SALUTATION'>SALUTATION</label><input id='field_SALUTATION' name='field_SALUTATION' type='text'></li>

<li><label for='field_COMPANYNAME'>COMPANYNAME</label><input id='field_COMPANYNAME' name='field_COMPANYNAME' type='text'></li>

<li><label for='field_FIRSTNAME'>FIRSTNAME</label><input id='field_FIRSTNAME' name='field_FIRSTNAME' type='text'></li>

<li><label for='field_MIDINIT'>MIDINIT</label><input id='field_MIDINIT' name='field_MIDINIT' type='text'></li>

<li><label for='field_LASTNAME'>LASTNAME</label><input id='field_LASTNAME' name='field_LASTNAME' type='text'></li>

<li><label for='field_CUSTFLD1'>Program Start Date</label><input id='field_CUSTFLD1' name='field_CUSTFLD1' type='text'></li>

<li><label for='field_CUSTFLD2'>Program End Date</label><input id='field_CUSTFLD2' name='field_CUSTFLD2' type='text'></li>

<li><label for='field_CUSTFLD3'>CUSTFLD3</label><input id='field_CUSTFLD3' name='field_CUSTFLD3' type='text'></li>

<li><label for='field_CUSTFLD4'>CUSTFLD4</label><input id='field_CUSTFLD4' name='field_CUSTFLD4' type='text'></li>

<li><label for='field_CUSTFLD5'>House</label><input id='field_CUSTFLD5' name='field_CUSTFLD5' type='text'></li>

<li><label for='field_CUSTFLD6'>DOC Number</label><input id='field_CUSTFLD6' name='field_CUSTFLD6' type='text'></li>

<li><label for='field_CUSTFLD7'>Birthdate</label><input id='field_CUSTFLD7' name='field_CUSTFLD7' type='text'></li>

<li><label for='field_CUSTFLD8'>CCO</label><input id='field_CUSTFLD8' name='field_CUSTFLD8' type='text'></li>

<li><label for='field_CUSTFLD9'>SOTP</label><input id='field_CUSTFLD9' name='field_CUSTFLD9' type='text'></li>

<li><label for='field_CUSTFLD10'>CUSTFLD10</label><input id='field_CUSTFLD10' name='field_CUSTFLD10' type='text'></li>

<li><label for='field_CUSTFLD11'>CUSTFLD11</label><input id='field_CUSTFLD11' name='field_CUSTFLD11' type='text'></li>

<li><label for='field_CUSTFLD12'>CUSTFLD12</label><input id='field_CUSTFLD12' name='field_CUSTFLD12' type='text'></li>

<li><label for='field_CUSTFLD13'>CUSTFLD13</label><input id='field_CUSTFLD13' name='field_CUSTFLD13' type='text'></li>

<li><label for='field_CUSTFLD14'>CUSTFLD14</label><input id='field_CUSTFLD14' name='field_CUSTFLD14' type='text'></li>

<li><label for='field_CUSTFLD15'>CUSTFLD15</label><input id='field_CUSTFLD15' name='field_CUSTFLD15' type='text'></li>

<li><label for='field_JOBDESC'>JOBDESC</label><input id='field_JOBDESC' name='field_JOBDESC' type='text'></li>

<li><label for='field_JOBTYPE'>JOBTYPE</label>
 <select id='field_JOBTYPE' name='field_JOBTYPE'>  <option value='' selected='selected'>No Value</option>
  <option value='Commercial'>Commercial</option>
  <option value='Program Status'>Program Status</option>
  <option value='Program Status:House Leader'>Program Status:House Leader</option>
  <option value='Program Status:Left Program'>Program Status:Left Program</option>
  <option value='Program Status:Program Participant'>Program Status:Program Participant</option>
  <option value='Program Status:Terminated'>Program Status:Terminated</option>
  <option value='Residential'>Residential</option> </select>
<script>
dataArray['TYPE-JOBTYPE'] = new Array();
dataArray['TYPE-JOBTYPE']['Commercial'] = 'Commercial';
dataArray['TYPE-JOBTYPE']['Program Status'] = 'Program Status';
dataArray['TYPE-JOBTYPE']['Program Status:House Leader'] = 'Program Status:House Leader';
dataArray['TYPE-JOBTYPE']['Program Status:Left Program'] = 'Program Status:Left Program';
dataArray['TYPE-JOBTYPE']['Program Status:Program Participant'] = 'Program Status:Program Participant';
dataArray['TYPE-JOBTYPE']['Program Status:Terminated'] = 'Program Status:Terminated';
dataArray['TYPE-JOBTYPE']['Residential'] = 'Residential';

</script>
</li>
<li><label for='field_JOBSTATUS'>JOBSTATUS</label><input id='field_JOBSTATUS' name='field_JOBSTATUS' type='text'></li>

<li><label for='field_JOBSTART'>JOBSTART</label><input id='field_JOBSTART' name='field_JOBSTART' type='text'></li>

<li><label for='field_JOBPROJEND'>JOBPROJEND</label><input id='field_JOBPROJEND' name='field_JOBPROJEND' type='text'></li>

<li><label for='field_JOBEND'>JOBEND</label><input id='field_JOBEND' name='field_JOBEND' type='text'></li>

<li><label for='field_HIDDEN'>HIDDEN</label><input id='field_HIDDEN' name='field_HIDDEN' type='text'></li>

<li><label for='field_DELCOUNT'>DELCOUNT</label><input id='field_DELCOUNT' name='field_DELCOUNT' type='text'></li>

<li><label for='field_PRICELEVEL'>PRICELEVEL</label>
 <select id='field_PRICELEVEL' name='field_PRICELEVEL'>  <option value='' selected='selected'>No Value</option>
  <option value='$300.00'>$300.00</option>
  <option value='n'>n</option> </select>
<script>
dataArray['TYPE-PRICELEVEL'] = new Array();
dataArray['TYPE-PRICELEVEL']['$300.00'] = '$300.00';
dataArray['TYPE-PRICELEVEL']['n'] = 'n';

</script>
</li>
<li><label for='submit'>Submit</label><input type='submit'></li>
  </ul>
 </fieldset>
</form>
<script>


$(document).ready(function() {
    Log.Remove();
});
</script>
</body>
</html>