proc p1  {} {
    foreach digit {1 2 3} {
        yield $digit
    }
    puts -->[p2]
}

proc p2 {} {
    foreach digit {4 5 6} {
        puts "p2 [info coroutine]"
        yield $digit
    }
}

proc alphadig {} {
    yield [info coroutine]
    p1
}


set name [coroutine c1 alphadig]
while 1 {
    set res [c1]
    if {[namespace which c1] eq $name } {
        puts "[namespace which c1] eq $name"
        puts $res
    } else {

        puts "[namespace which c1] ne $name"
        #discard last result, which is the coroutine "falling off the end" rather
        #than a real value
        break
    }
}
