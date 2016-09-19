set db [ns_db gethandle pool1]

set result [ns_db select $db "select * from hom_houses order by house_name"]

set html "<ul>"

while {[ns_db getrow $db $result]} {
    set house [ns_set get $result house_name]
    ns_log Notice "house = '$house'"
    append html "\n<li>house = '$house'</li>"
}

append html "\n</ul>"

ns_return 200 text/html $html