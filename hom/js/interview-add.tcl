set form [ns_conn form]

set html "<ul>"

for {set i 0} {$i < [ns_set size $form]} {incr i} {
    set key [ns_set key $form $i]
    set value [ns_set value $form $i]
    append html "<li>$key = '$value'</li>"
}

append html "</ul>"

ns_return 200 text/html $html