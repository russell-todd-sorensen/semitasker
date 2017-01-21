<!DOCTYPE HTML>
<html>
<head>
 <title>Participant Interview Checklist</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="/css/main.css" media="all">
<link rel="stylesheet" type="text/css" href="/css/log.css" media="all">
<link rel="stylesheet" type="text/css" href="/js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.all.css">
<link rel="stylesheet" type="text/css" href="/hom/css/checklist-modified.css">

<script src="/js/jquery-1.7.1.js"></script>
<script src="/js/jQuery.UI.Combined.1.8.20.1/Content/Scripts/jquery-ui-1.8.20.js"></script>
<script src="/js/d3.v3.js"></script>
<script src="/js/log-2.js"></script>
<script src="/js/data.js"></script>
<script src="/js/form-save-restore.js"></script>
<script src="/js/example-library.js"></script>
<script src="/js/html-utilities.js"></script>
<script src="/hom/js/checklist-modified.js"></script>

<style>
#location-address {
    margin-left: 252px;
    
}

</style>
<%
set db [ns_db gethandle pool1]

set result [ns_db select $db "select * from hom_house_address_view order by house_name"]
set westernHeader "-- Western Washington --"
set easternHeader "-- Eastern Washington --"
set westernHouseList [list $westernHeader ]
set easternHouseList [list $easternHeader ]

set westernHouseOptions " <option value=''>$westernHeader</option>"
set easternHouseOptions " <option value=''>$easternHeader</option>"
set formattedAddresses ""

while {[ns_db getrow $db $result]} {
    set house [ns_set get $result house_name]
    set city  [ns_set get $result city]
    set house_addr1 [ns_set get $result addr1]
    set house_addr2 [ns_set get $result addr2]
    set house_addr3 [ns_set get $result addr3]
    set state [ns_set get $result state]
    set zip [ns_set get $result postal_code]
    set formattedAddress($house) "\n<pre>$house_addr1\n$house_addr2\n$city, $state $zip</pre>"
    set formattedAddressJavascript "$house_addr1\\n$house_addr2\\n$city, $state $zip"
    append formattedAddresses $formattedAddress($house)
    append formattedAddressesJavascript "\nformattedAddresses\['$house'] = '$formattedAddressJavascript';\n"
    ns_log Notice "house = '$house'"
    if {$city == "Spokane" || $city == "Yakima"} {
        lappend easternHouseList $house
        append easternHouseOptions "\n <option value='$house'>$house</option>"
    } else {
        lappend westernHouseList $house
        append westernHouseOptions "\n <option value='$house'>$house</option>"
    } 
}

set houseOptionString [join [concat $westernHouseList $easternHouseList] ","]

set sqlQuestions "select 
 column_sort_order,
 column_name as \"name\",
 column_title as title,
 column_help as help,
 column_enabled as enabled,
 column_length as \"length\",
 column_type as \"type\",
 column_data as \"data\",
 column_default as \"default\"
from 
 hom_interview_questions
where
 column_enabled = true
order by 
 column_sort_order;"
 
ns_log Notice "sqlQuestions = '$sqlQuestions'"

set result2 [ns_db select $db $sqlQuestions]
set questions "//questions\n"
while {[ns_db getrow $db $result2]} {
   set column_sort_order [ns_set get $result2 column_sort_order]
   set name [ns_set get $result2 name]
   set title [ns_set get $result2 title]
   set help [ns_set get $result2 help]
   set enabled [ns_set get $result2 enabled]
   if {$enabled == "t"} {
       set enabled "true"
   } else {
       set enabled "false"
   }
   set length [ns_set get $result2 length]
   set type [ns_set get $result2 type]
   set data [ns_set get $result2 data]
   set default [ns_set get $result2 default]
   if {$name ne "location" } {
        set data "'$data'"
   }
   append questions "newQuestion('$name','$title','$help',$enabled,$length,'$type',$data,'$default');\n"
}

 
%>
</head>
<body>

<script>
// Javascript Addresses
var formattedAddresses = new Array();
<%= $formattedAddressesJavascript %>
var houseOptionString = "<%= $houseOptionString %>"
<%= $questions %>

function LogInput(inputId) {
    Log.Notice('LogInput ' + inputId + '="' + $('#' + inputId).val() + '"');
}

function LogChbox(inputId) {
    Log.Notice('LogChbox ' + inputId + '="' + Data.getCheckboxValues(inputId) + '"');
}

$(document).ready(function() {
    //Log.Remove();
    Log.Show();
    initForm('#form1 #panel');
    /* to show the address associated with the selected location,
    // we must modify the default code path and add a container for the address
     */
    Data.saveSelect('location','showAddress');
    $('#location')
        .attr(
            'onchange',
            'Data.saveSelect("location","showAddress");showAddress("location");'
        );
    
    var parent = $('#location').parent();
    parent.append("<pre id='location-address'></pre>");
    
    // setup the following: when SO level is N/A, choose SOTP: N/A also. ....
    // Better yet: make the input hidden so it can't be changed, just show N/A
    // in that field.
    
    $('#level')
        .attr('onchange','updateSOTPRequirement("level","sotp_required");');
    
    $('#isrb_releasable, #date_of_interview, #notifier')
        .attr('onchange','updateEstimatedReleaseDate("est_release_date")');
    $('#age')
        .attr('onchange','convertBirthdateToAge("age","birthdate")');
    $('#age')
        .attr('onclick','convertPlaceholderTextToAge("age","birthdate")');
    var hiddenBirthdate = $('#birthdate').val();
    if (hiddenBirthdate) {
        $('#age').attr('placeholder',hiddenBirthdate);
        convertPlaceholderTextToAge("age","birthdate");
    }
    
});

</script>
<div id="container">
<form id="form1" method="post" enctype="multipart/form-data" action="return false;">
<fieldset>
<legend>Participant Interview Form</legend>
<ul id="panel">
<!-- Questions will go here -->
</ul>
</fieldset>
</form>

</div>

</body>
</html>