# Code to performance test list and ns_set access.

set len 1000
set mylist [list]

for {set i 0} {$i<$len} {incr i} {
    lappend mylist $i
}
set timing [list]
for {set i 0} {$i<$len} {incr i} {
    set time [time {lindex $mylist $i} 10]
    lappend timing [lindex $time 0]
}
lappend timing ([join [lrange $time 1 end]])

set lsettiming [list]
set newlist $mylist
for {set i 0} {$i<$len} {incr i} {
    set nv "${i}n"
    set lsettime [time {lset newlist $i $nv} 10]
    lappend lsettiming [lindex $lsettime 0]
}
lappend lsettiming ([join [lrange $lsettime 1 end]])



set ptiming [list]
set vtiming [list]
set vvtiming [list]
set myset [ns_set create]
for {set j 0} {$j<$len} {incr j} {
    set ptime [time {ns_set put $myset $j $j}]
    lappend ptiming [lindex $ptime 0]
    set vtime [time {ns_set value $myset $j} 10]
    lappend vtiming [lindex $vtime 0]
}
lappend ptiming ([join [lrange $ptime 1 end]])
lappend vtiming ([join [lrange $vtime 1 end]])

for {set j 0} {$j<$len} {incr j} {
    set vvtime [time {ns_set value $myset $j} 10]
    lappend vvtiming [lindex $vvtime 0]
}
lappend vvtiming ([join [lrange $vvtime 1 end]])

set cputtiming [list]
for {set k 0} {$k<$len} {incr k} {
    set cputtime [time {ns_set cput $myset $k $k} 10]
    lappend cputtiming [lindex $cputtime 0]
}
lappend cputtiming ([join [lrange $cputtime 1 end]])

set utiming [list]
for {set k [expr {$len - 1}]} {$k>=0} {incr k -1} {
    set nv "${k}n"
    set utime [time {ns_set update $myset $k $nv} 10]
    lappend utiming [lindex $utime 0]
}
lappend utiming ([join [lrange $utime 1 end]])

set gufinal [list]
for {set k 0} {$k<$len} {incr k} {
    set guvalue [ns_set value $myset $k]
    lappend gufinal "($k $guvalue)"
}


ns_return 200 text/plain "
len='$len'

mylist='$mylist'

timing='$timing'

newList starts as a copy of mylist
newlist='$newlist'

lset timings are into a list of $len elements
lsettiming='$lsettiming'

myset='$myset'

ptiming='$ptiming'

vtiming='$vtiming'

vvtiming='$vvtiming'

cputtiming='$cputtiming'

utiming='$utiming'

gufinal='$gufinal'"
