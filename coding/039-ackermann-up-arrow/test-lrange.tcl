
set x [list a b c]
set joined ""
catch {
    set joined [join [lrange $x {*}{0 1}]]
}

ns_return 200 text/plain $joined