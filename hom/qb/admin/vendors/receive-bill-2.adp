<!DOCTYPE HTML>
<html>
<head>
 <title>Receive Bill 2</title>
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
<!--<script src="js/receive-bill.js"></script>-->

<style>

#accounts th, 
#accounts, 
#accounts td {
    font-size: 25px;
    padding: 2px;
    border: 1px solid black;
    border-collapse: collapse;
}

#accounts nobr {
    border: none;
    margin: 0;
    padding: 0;
    border-collapse: collapse
}

#accounts {
    margin-left: 10px;
    margin-top: 10px;
}

#accounts th {
    font-weight: bold;
    text-align: center;
}

#accounts tr:nth-child(odd) {
    background-color: #ddd;
}

#accounts .green {
    color: green;
    display: block;
}

#accounts .red {
    color: red;
    display: block;
}

#accounts .yellow {
    color: yellow;
    display: block;
}

#outer-container {
    width: 1200px;
    background-color: #aaa;
    padding: 10px;
}

#accounts .gap {
    text-align: center;
}

#received_on,
#actual_due,
#receive_bill_button {
    font-size: 25px;
}

</style>
<%

set form [ns_conn form]

proc quote_it { string } {
 string map {' ''} $string
}

set schedule_id [ns_set get $form schedule_id]
set actual_due [quote_it [ns_set get $form actual_due]]
set received_on [quote_it [ns_set get $form received_on]]

ns_log Notice "schedule_id='$schedule_id'"

if {![string is integer -strict $schedule_id]} {
    ns_return 200 text/plain "schedule_id isn't an integer"
    return -code return
}

set sql "update
 hom_scheduled_bills
set
 actual_due = '$actual_due',
 received_on = '$received_on'
where
 schedule_id = $schedule_id;"


set db [ns_db gethandle pool1]

ns_db dml $db $sql

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
 sb.actual_due - now()::date as gap_actual,
 now()::date as today,
 hvm.house_id,
 hvt.vendor_type_id,
 hvt.type_name,
 hvt.type_descr,
 hh.house_name
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
LEFT OUTER JOIN
 hom_house_vendor_map hvm
ON
 va.vendor_account_number = hvm.vendor_account_number
LEFT OUTER JOIN
 hom_vendor_types hvt
ON 
 hvm.vendor_type_id = hvt.vendor_type_id
LEFT OUTER JOIN
 hom_houses hh
ON
 hvm.house_id = hh.house_id
WHERE
 sb.schedule_id = $schedule_id
order by
 hvm.vendor_type_id;
"
set html "

<table id='accounts'>

"
set result [ns_db select $db $sql]

set row 0

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
    set today [ns_set get $result today]
    set house_id [ns_set get $result house_id]
    set vendor_type_id [ns_set get $result vendor_type_id]
    set type_name [ns_set get $result type_name]
    set type_descr [ns_set get $result type_descr]
    
  if {$row == 0} {
  
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
        set received_on $today
    }
    
    append html "
<tr>
 <th><label for='vendor_name'>Vendor</label></th><td >$vendor_name</td>
</tr>
<tr>
 <th><label for='est_due'>Estimated Due</label></th><td>$est_due</td>
</tr>
<tr>
 <th><label for='actual_due'>Actual Due</label></th>
 <td>$actual_due</td>
</tr>
<tr>
 <th><label for='est_received_by'>Estimated Received</label></th><td>$est_received_by</td>
</tr>
<tr>
 <th><label for='received_on'>Received On</label></th>
 <td>$received_on</td>
</tr>
<tr>
 <th><label for='gap'>Days Until Due</label></th>
 <td><span class='$class'>$gap ($gap_actual)</span></td>
</tr>
<tr>
 <th><label for='vendor_account_number'>Account Number</label></th>
 <td class='$class'>$vendor_account_number</td>
</tr>
</table>
<form action='receive-bill-3.adp' method='POST' enctype='multipart/form-data'>
<table id='accounts'>
"
  }
  append html ""
}

append html "</form>"

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
