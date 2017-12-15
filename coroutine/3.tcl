set fdin [open infile.txt r]
set fdout [open outfile.txt w+]

while {"True"} {
    set a [read $fdin 1]
    if {"$a" == "~"} {
        break
    } else {
        puts -nonewline $fdout $a
    }
}

puts $fdout ""

close $fdout
close $fdin
