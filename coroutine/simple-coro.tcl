source coroutine-library.tcl;

proc CoA {} {
    Detach;

    puts -nonewline "A1 ";
    Resume B;
    puts -nonewline "A2 ";
    Resume B;
    puts -nonewline "A3 ";
    Resume Main;
}

proc CoB {} {
    Detach;

    puts -nonewline "B1 ";
    Resume A;
    puts -nonewline "B2 ";
    Resume A;
    puts -nonewline "B3 ";
    Resume Main;
}


proc MainProgram {} {
    coroutine A CoA;
    coroutine B CoB;

    Resume A;

    puts "STOP ";
    flush stdout;
}

coroutine Main MainProgram;
