namespace eval :ext::resource {
    variable scriptURL [ns_url2file [ns_conn url]]
    variable scriptRoot [file rootname $scriptURL]
    init
}

::ext::resource::add header ::ext::resource::includeNS [file join $scriptRoot header.tmpl]