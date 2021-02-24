<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1" >
<meta name="theme-color" content="rgba(0,102,153,1.0)" >
<meta name="description" content="Client requested resource was not found." >
<%
set request [ns_conn request]
set url [ns_quotehtml [lindex $request 1]]
set method [ns_quotehtml [lindex $request 0]]
set httpVersion [ns_quotehtml [lindex $request 2]]
set transport [ns_quotehtml [string toupper [ns_conn protocol]]]
set tail [ns_quotehtml [file tail [lindex $request 1]]]
set title "Requested Resource Was Not Found"
set hostHeader [ns_quotehtml [ns_set iget [ns_conn headers] host]]
set referer \"[ns_urlencode [ns_set iget [ns_conn headers]  referer "None Sent"] ]\"
%>
<title><%= $title %> <%= $tail %></title>
<style>
body {
    font-family: 'Fira Code', 'sans serif';
}
.quoted {
    font-weight: bold;
}
.quoted::before,
.quoted::after {
    content: "'";
}
</style>
</head>
<body>
<h3><%= $title %> <span class="quoted"><%= $tail %></span></h3>
<h4>More Information</h4>
<ul>
 <li>HTTP Method: <%= $method %></li>
 <li>Host Header: <%= $hostHeader %></li>
 <li>Request URL: <%= $url %></li>
 <li>Transport Scheme: <%= $transport %></li>
 <li>Referer URL: <%= $referer %></li>
 <li>Full Original Request:  <span class="quoted"><%= "[ns_quotehtml $request]" %></span></li>
</ul>
</body>
</html>