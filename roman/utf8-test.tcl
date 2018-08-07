if {[info exists script]} {
    set orig $script
} else {
    set orig "none"
}
if {false} {
set fd [open ↈↀↁↇ.html r]
#set fd [open 144000.html r]
set data [read $fd]

set script [info script]
set pwd [pwd]


    ns_return 200 text/plain "orig='$orig'
    script='$script'
    pwd='$pwd'"
}
set pageroot [ns_server -server ns pagedir]
set url [ns_conn url]
set filename [file join $pageroot [string trimleft $url / ]]
set dirname [file dirname $filename]
set files [glob -directory $dirname *]
set fd [open [file join $dirname 144000.html] r]
set data [read $fd]

ns_return 200 text/plain "pageroot='$pageroot'
url='$url'
filename='$filename'
files = [join $files \n]
data='$data'"
