
::ext::resource::init

::ext::resource::add myEcho ::ext::resource::echo a b c
::ext::resource::add myEcho2 ::ext::resource::echo

::ext::resource::add header ::ext::resource::include header.tmpl

set final [::wtk::ttt::applyTemplateNS]

ns_return {*}$final