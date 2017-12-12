while {"True"} {
    set a [read stdin 1]
    if {"$a" == "~"} {
        return
    } else {
        puts -nonewline stdout $a
    }
}
