


proc Resume {what args} {
    uplevel 1 yieldto $what {*}$args
}

proc Call {what args} {
    uplevel 1 $what {*}$args
}

proc Detach {} {
    uplevel 1 yield
}


namespace eval ::textTransform {
    variable CardLength = 80;
    variable Card = [list];
    variable Line = [list];
    variable c1;
    variable c2;

    proc Reader {} {
        variable CardLength;
        variable Card;

        while {"True"} {
            for {set i 0} {$i < $CardLength} {incr i} {
                lset Card $i [read stdin 1]
            }
            Resume theDisassembler;
        }
    }

    proc Disassembler {} {
        variable CardLength;
        variable Card;
        variable c1;

        while {"True"} {
            Resume theReader;
            for {set i 0} {$i < $CardLength} {incr i} {
                set c1 = [lindex $Card $i];
                Resume theSquasher;
            }
            set c1 " ";
            Resume theSquasher;
        }
    }

    proc Squasher {} {
        variable c1;
        variable c2;

        while {"True"} {

            if {"$c1" eq "*"} {
                Resume theDisassembler;
                if {"$c1" eq "*"} {
                    set c2 "^";
                    Resume theAssembler;
                } else {
                    set c2 "*"
                    Resume theAssembler;
                    set c2 $c1
                }
            } else {
                set c2 $c1
            }
            Resume theAssembler;
            Resume theDisassembler;
        }
    }

    proc Assembler {} {
        variable LineLength;
        variable Line;
        variable c2;

        while {"True"} {
            for {set i 0} {$i < $LineLength} {incr i} {
                lset Line $i $c2
                if {"$c2" eq "~"} {
                    while {[incr i] < $LineLength} {
                        lset Line $i " ";
                    }
                    Resume thePrinter;
                    Detach; # back to main program
                }
                Resume theSquasher;
            }
            Resume thePrinter;
        }
    }

    proc Printer {} {
        variable LineLength;
        variable Line;

        while {"True"} {
            for {set i 0} {$i < $LineLength} {incr i} {
                puts -nonewline [lindex $Line $i]
            }

            puts "";
            Resume theAssembler;
        }
    }

    coroutine theReader Reader;
    coroutine theDisassembler Disassembler;
    coroutine theSquasher Squasher;
    coroutine theAssembler Assembler;
    coroutine thePrinter Printer;

    Resume theDisassembler;

}
