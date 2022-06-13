namespace eval top {
    variable mylist [list a b c d e]
    variable len [llength $mylist]
}


proc printMylist {ns} {
    namespace eval $ns {puts $mylist}
}

proc simplePrintMylist {ns} {
    apply [list {} {
        variable mylist 
        puts $mylist
    } $ns]
}