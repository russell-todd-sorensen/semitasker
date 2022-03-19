
::ext::resource::init

::ext::resource::add myEcho ::ext::resource::echo a b c
::ext::resource::add myEcho2 ::ext::resource::echo

::ext::resource::add header ::ext::resource::includeNS header.tmpl
::ext::resource::add footer ::ext::resource::includeNS footer.tmpl

set title "This page has included header and footer"

ns_log Notice [array get ::ext::resource::rar]

set final [::wtk::ttt::applyTemplateNS]

ns_return {*}$final