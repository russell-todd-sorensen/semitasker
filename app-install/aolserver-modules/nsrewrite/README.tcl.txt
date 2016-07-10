How to use ns_rewriteurl

**Introduction

The nsrewrite module for AOLserver provides a very simple method to 
change the Request URL during request processing.

An HTTP request has the following basic form:


GET /path/to/file/file.adp?x=a HTTP/1.0
Host: www.example.com



In this example request, GET is the request Method, 
/path/to/file/file.adp is the URL, and x=a is the querystring. 
HTTP/1.0 identifies the request as being HTTP version 1.0.

**Request Processing in AOLserver

In AOLserver, each HTTP request passes through a series of steps:

- PreAuth Registered Filters
- Authentication
- PostAuth Registered Filters
- Closest Matching Registered Procedure
- Trace Registered Filters

***Filter Processing in AOLserver

A filter is composed of a pattern and a procedure. A filter is added 
to one of the three lists of filters (PreAuth, PostAuth, Trace) by 
calling ns_register_filter from tcl as follows:


ns_register_filter preauth GET /a/b/*.html myHtmlProc
ns_register_filter preauth GET /a* myEverythingProc
ns_register_filter postauth GET /a/one.html myOneProc


When AOLserver processes a request through a set of filters, each 
filter is tried in the order it was registered. If the Request URL 
matches the pattern in the filter, the filter procedure is run. When 
the procedure finishes, the next filter pattern is tried for a match 
to the Request URL.

In the above list of registered filters, a GET request for the url 
/a/b/c.html would match the first two filters, but not the third 
filter. A POST, or HEAD request on the same url would not match any of 
the filters.

***Rewriting the Request URL

The above discussion assumed that the Request URL remained the same 
throughout the lifetime of the request. However, the filter matching 
process is performed in series with the filter procedure that is run. 
If the filter procedure were to change the Request URL, the next 
filter pattern in the series would be compared to the new Request URL.

The nsrewrite module for AOLserver provides a convenient means to 
modify the Request URL. The use of this procedure within a filter 
allows for some interesting possibilities.

***A simple virtual hosting module

Following is an example use of the nsrewrite module to provide virtual 
hosting inside a single AOLserver.

The nsrewrite module provides a single tcl procedure to set the 
Request URL:


ns_rewriteurl $new_url


Once this procedure is called, the procedure [ns_conn url] will return 
the value of $new_url. If the Request URL value was used only at the 
start of a request, or if the filter matching was done with a copy of 
the Request URL, this procedure would be of no other value. However, 
the new Request URL is used for any additional filter matching and for 
Registered Procedure matching in step 4 above.

Consider the filter procedure:


proc rewriteRequest { why } {

    set url [ns_conn url]
    ns_log Notice "rewriteRequest: starturl: '$url'"

    set host [string tolower [ns_set iget [ns_conn headers] host]] 
    
    if {![string match "" $host]} {
    set new_url "/${host}$url"
    ns_rewriteurl $new_url
    ns_log Notice "rewriteRequest: newurl: '$new_url'"
    } 
    return filter_ok
}



rewriteRequest prepends the value of the request Host: header to the 
URL so that the request detailed above in the Introduction could 
result in the following:


ns_rewriteurl /www.example.com/path/to/file/file.adp


I say could, because we need to register the filter correctly:


# Fire rewriteRequest on every request
ns_register_filter preauth GET /* rewriteRequest


Now that we prepend the host header to the original URL, we need to 
clean up the problem of users typing 'www.' in front of the host name.

Since filter pattern matching is just like [string match $pattern 
$url], we can write a procedure, and corresponding registered filter 
to handle this case:


proc rewriteWWW { why } {

    set new_url "/[string range [ns_conn url] 5 end]"
    ns_log Notice "rewriteWWW: url: '[ns_conn url]' newurl: 
'$new_url'"
    ns_rewriteurl $new_url
    return filter_ok
}

# rewrite URLs beginning with www:
ns_register_filter preauth GET /www.* rewriteWWW



This would cause the following call to ns_rewriteurl


ns_rewriteurl /example.com/path/to/file/file.adp


Since this is the last PreAuth filter (in this example), AOLserver 
authorization will now take place on the new URL 
/example.com/path/to/file/file.adp

Passing the authorization stage, AOLserver will process all PostAuth 
filters. ( PreAuth and PostAuth filtering is stopped if any PreAuth 
filter returns filter_return, or any PostAuth filter returns 
filter_return or filter_break. )

If all PreAuth and PostAuth filters finish and none of them have 
returned filter_return, the Registered Procedures are examined to 
determine if there is a match. At most one Registered Procedure will 
match. AOLserver uses a data structure know as a Trie to store and 
locate the Registered Procedure with the closest match to the Request 
URL. Registered Procedure matching is different than matching with 
Registered Filters. Only the ending of the URL pattern is allowed to 
have a glob characters. However, matching can be inherited below the 
URL pattern specified. By default, the fastpath procs are registered 
at server startup for all URLs and the GET, POST and HEAD methods (in 
C, from nsd/fastpath.c):


/* server, Method, URL, Procedure, DeleteProc, userContext, Flags */
Ns_RegisterRequest(server, "GET", "/", FastGet, NULL, NULL, 0);
Ns_RegisterRequest(server, "HEAD", "/", FastGet, NULL, NULL, 0);
Ns_RegisterRequest(server, "POST", "/", FastGet, NULL, NULL, 0);


In our example virtual host server, all requests will end up being 
served by the FastGet function, which makes this virtual 
server...fast!

Finally, any trace filters will be run, regardless of any return codes 
from previous Registered Filters of Registered Procedures.

Here is a filter which will log the final Request URL:


proc finalURL { why } {

    ns_log Notice "finalURL: URL: '[ns_conn url]'"
    return filter_ok
}

# show final URL in trace filter
ns_register_filter trace GET /* finalURL



**Virtual Hosting Module

Below is a copy of the simple virtual hosting module described above:


#
# The contents of this file are subject to the AOLserver Public 
License
# Version 1.1 (the "License"); you may not use this file except in
# compliance with the License. You may obtain a copy of the License at
# http://aolserver.com/.
#
# Software distributed under the License is distributed on an "AS IS"
# basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
# the License for the specific language governing rights and 
limitations
# under the License.
#
# The Original Code is AOLserver Code and related documentation
# distributed by AOL.
# 
# The Initial Developer of the Original Code is America Online,
# Inc. Portions created by AOL are Copyright (C) 1999 America Online,
# Inc. All Rights Reserved.
#
# Alternatively, the contents of this file may be used under the terms
# of the GNU General Public License (the "GPL"), in which case the
# provisions of GPL are applicable instead of those above.  If you 
wish
# to allow use of your version of this file only under the terms of 
the
# GPL and not to allow others to use your version of this file under 
the
# License, indicate your decision by deleting the provisions above and
# replace them with the notice and other provisions required by the 
GPL.
# If you do not delete the provisions above, a recipient may use your
# version of this file under either the License or the GPL.
#

#
# $Header$
#
#
# rewriteurl.tcl -- Demonstrate use of ns_rewriteurl
#

ns_log Notice "tcl/rewriteurl.tcl: loading test rewrite filters..."

# rewriteRequest prepends the host header to the URL
# http://example.com/some/url.html -> /example.com/some/url.html

# to test:
# echo "127.0.0.1 example.com www.example.com" >> /etc/hosts
# run aolserver on 127.0.0.1:80
# create a test file in $pageroot/example.com/
# visit http://example.com/test.file or 
http://www.example.com/test.file

proc rewriteRequest { why } {

    set url [ns_conn url]
    ns_log Notice "rewriteRequest: starturl: '$url'"

    set host [string tolower [ns_set iget [ns_conn headers] host]] 
    
    if {![string match "" $host]} {
    set new_url "/${host}$url"
    ns_rewriteurl $new_url
    ns_log Notice "rewriteRequest: newurl: '$new_url'"
    } 
    return filter_ok
}


proc finalURL { why } {

    ns_log Notice "finalURL: URL: '[ns_conn url]'"
    return filter_ok
}

proc rewriteWWW { why } {

    set new_url "/[string range [ns_conn url] 5 end]"
    ns_log Notice "rewriteWWW: URL: '[ns_conn url]' newurl: 
'$new_url'"
    ns_rewriteurl $new_url
    return filter_ok
}


# Fire rewriteRequest on every request
ns_register_filter preauth GET /* rewriteRequest

# rewrite URLs beginning with www:
ns_register_filter preauth GET /www.* rewriteWWW

# show final URL in trace filter
ns_register_filter trace GET /* finalURL


ns_log Notice "tcl/rewriteurl.tcl: finished loading test rewrite 
filters."

