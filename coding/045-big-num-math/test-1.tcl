set result 0
set page [list]
set code 200
try {
    set binDir [set ::wtk::ttt::binDir]
    lappend page "binDir=$binDir"
    set thisScript [info script]
    set thisScript [ns_url2file [ns_conn url]]
    lappend page "thisScript=$thisScript"
    set rootName [file rootname $thisScript]
    lappend page "rootName=$rootName"

} on error {result options} {
    lappend page result: $result  options: $options
    set code 500
}

# only use applyTemplateNS with naviserver
set final [::wtk::ttt::applyTemplateNS]

if {[lindex $final 0] != 200} {
    lappend page templateError $final
    set res [lassign $final code desc]
    lappend page res $res
    ns_return $code $desc [join $page "\n"]
    return -code return
} else {
    ns_return {*}$final
}