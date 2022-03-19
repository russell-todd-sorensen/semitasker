
::ext::resource::init

::ext::resource::add matrix1 ::ext::resource::matrix IN

#::ext::resource::add header ::ext::resource::includeNS header.tmpl
#::ext::resource::add footer ::ext::resource::includeNS footer.tmpl

set IN [list 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15]

set title "This page has included header and footer"

ns_log Notice [array get ::ext::resource::rar]

set final [::wtk::ttt::applyTemplateNS]

ns_return {*}$final