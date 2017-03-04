<!DOCTYPE HTML>
<html>
<head>
 <title>Current Accounts Payable</title>
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
<!--<script src="js/accounts-payable-current.js"></script>-->

<style>

body {
    font-family: DecimaMono, Consolas, Monaco, monospace;
    /*font-family: "ff-tisa-web-pro",Georgia,Times,"Times New Roman",serif; */
}

#outer-container {
    width: 1250px;
    background-color: #ddd;
    padding: 10px;
}

#accounts a:link,
#accounts a:visited {
    font-weight: bold;
    display: inline-block;
    text-decoration: none;
    color: #444;
}

#accounts a:hover, 
#accounts a:active {
    text-decoration: underline;
    color: #a44;
    background-color: ‎#960018;
}

#accounts th, 
#accounts, 
#accounts td {
    padding: 2px;
    padding-right: 5px;
    padding-left: 5px;
    border: 1px solid black;
    border-collapse: collapse;
}

#accounts nobr {
    border: none;
    margin: 0;
    padding: 0;
    border-collapse: collapse;
    font-weight: bold;
}

#accounts {
    margin-left: 10px;
    margin-top: 10px;
}

#accounts th {
    font-weight: bold;
    text-align: center;
    background-color: tan;
    font-size: larger;
}

#accounts tr:nth-child(odd) {
    background-color: #eee;
}

#accounts .green {
    color: forestgreen;
    display: block;
}

#accounts .red {
    color: #c00;
    display: block;
}

#accounts .yellow {
    color: #33f;
    display: block;
}

#accounts .gap {
    text-align: center;
    font-weight: bold;
}

#accounts .date {
    text-align: center;
    font-weight: bold;
}

</style>
<%
set db [ns_db gethandle pool1]

set sql "select
 sb.schedule_id,
 sb.account_id,
 sb.est_due,
 sb.est_received_by,
 sb.received_on,
 sb.actual_due,
 sb.paid_on,
 va.vendor_id,
 va.vendor_account_number,
 ve.vendor_name,
 sb.est_due - now()::date as gap,
 sb.actual_due - now()::date as gap_actual
FROM
 hom_scheduled_bills sb
LEFT OUTER JOIN
 hom_vendor_accounts va
ON
 sb.account_id = va.account_id
LEFT OUTER JOIN
 hom_vendors ve
ON
 va.vendor_id = ve.vendor_id
order by
 sb.est_due;
"
set html "<table id='accounts'>
<tr>
 <th>Vendor</th>
 <th><nobr>Estimated Due</nobr></th>
 <th><nobr>Estimated Recv</nobr></th>
 <th><nobr>Received On</nobr></th>
 <th><nobr>Days Until Due</nobr></th>
 <th><nobr>Account Number/Pay Now</nobr></th>
</tr>
"
set result [ns_db select $db $sql]

while {[ns_db getrow $db $result]} {
    set schedule_id [ns_set get $result schedule_id]
    set account_id [ns_set get $result account_id]
    set est_due [ns_set get $result est_due]
    set est_received_by [ns_set get $result est_received_by]
    set received_on [ns_set get $result received_on]
    set actual_due [ns_set get $result actual_due]
    set paid_on [ns_set get $result paid_on]
    set vendor_id [ns_set get $result vendor_id]
    set vendor_account_number [ns_set get $result vendor_account_number]
    set vendor_name [ns_set get $result vendor_name]
    set gap [ns_set get $result gap]
    set gap_actual [ns_set get $result gap_actual]
    
    if {[string is integer -strict $gap_actual]} {
        set gap $gap_actual    
    }
    
    if {$gap > 5} {
      set class "green"
    } elseif {$gap > 0} {
      set class "yellow"
    } else {
      set class "red"
    }
        
    if {$received_on eq ""} {
        set received_on "<a href='receive-bill.adp?schedule_id=$schedule_id'><nobr>Receive Now</nobr></a>"
    }
    
    append html "
<tr>
 <td class='$class'><nobr>$vendor_name</nobr></td>
 <td class='date'>$est_due</td>
 <td class='date'>$est_received_by</td>
 <td class='date'>$received_on</td>
 <td class='gap'><span class='$class'>$gap</span></td>
 <td class='$class'><a href='pay-bill.adp?schedule_id=$schedule_id'><nobr>$vendor_account_number</nobr></a></td>
</tr>"

}

append html "
</table>"

%>

</head>
<body>

<script>
$(document).ready(function() {
    Log.Remove();
    //Log.Show();
    
});  
</script>

<div id="outer-container">
<%= $html %>
</div>

</body>
</html>
