


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
    variable CardLength 80;
    variable LineLength 125;
    variable Card [list];
    variable Line [list];
    variable c1;
    variable c2;
    variable fdin;
    variable fdout;


    proc Reader {} {
        variable CardLength;
        variable Card;
        variable fdin;

        Detach

        while {"True"} {
            for {set i 0} {$i < $CardLength} {incr i} {
                puts stdout "Reading char...$i"
                lset Card $i [read $fdin 1]
            }
            puts stdout "Done Reading...";

            Resume theDisassembler;
        }
    }

    proc Disassembler {} {
        variable CardLength;
        variable Card;
        variable c1;

        Detach

        while {"True"} {
            puts stdout "Before the reader in Disassembler"
            Resume theReader;
            puts stdout "Past the reader in Disassembler"
            for {set i 0} {$i < $CardLength} {incr i} {
                set c1 [lindex $Card $i];
                Resume theSquasher;
            }
            set c1 " ";
            Resume theSquasher;
        }
    }

    proc Squasher {} {
        variable c1;
        variable c2;

        Detach

        while {"True"} {

            if {"$c1" eq "*"} {
                Resume theDisassembler;
                if {"$c1" eq "*"} {
                    set c2 "^";
                    #Resume theAssembler;
                    #Resume theDisassembler;
                    #continue;
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
        variable fdout;

        Detach

        while {"True"} {
            for {set i 0} {$i < $LineLength} {incr i} {
                puts "Assembler i = $i"
                lset Line $i $c2
                if {"$c2" eq "~"} {
                    while {[incr i] < $LineLength} {
                        lset Line $i " ";
                    }
                    puts "Assembler before thePrinter"
                    Resume thePrinter;
                    Detach; # back to main program
                }
                puts "Assembler before theSquasher"
                Resume theSquasher;
            }
            Resume thePrinter;
        }
    }

    proc Printer {} {
        variable LineLength;
        variable Line;
        variable fdout;

        Detach

        while {"True"} {
            for {set i 0} {$i < $LineLength} {incr i} {
                puts stdout "Printer char='[lindex $Line $i]'"
                puts -nonewline $fdout [lindex $Line $i]
            }

            puts $fdout " ";
            Resume theAssembler;
        }
    }

    proc Main {} {
        variable fdin  [open infile.txt r]
        variable fdout [open c:/naviserver/servers/ns/tmp/outfile.txt w+]
        puts $fdout "Starting output"
        puts stdout "...starting in Main"

        Resume theDisassembler;

        puts stdout "...finished with Main"
    }

    coroutine theReader Reader;
    coroutine theDisassembler Disassembler;
    coroutine theSquasher Squasher;
    coroutine theAssembler Assembler;
    coroutine thePrinter Printer;
    coroutine theMainCoroutine Main;

    flush $fdout
    close $fdout
    close $fdin
}
