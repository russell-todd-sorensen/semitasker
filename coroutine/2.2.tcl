source coroutine-library.tcl

namespace eval ::textTransform {
    Shared CardLength 80;
    Shared LineLength 125;
    Shared Card [list];
    Shared Line [list];
    Shared c1;
    Shared c2;
    Shared fdin;
    Shared fdout;


    proc Reader {} {
        Shared CardLength;
        Shared Card;
        Shared fdin;

        Pause

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
        Shared CardLength;
        Shared Card;
        Shared c1;

        Pause

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
        Shared c1;
        Shared c2;

        Pause

        while {"True"} {

            if {"$c1" eq "*"} {
                Resume theDisassembler;
                if {"$c1" eq "*"} {
                    set c2 "^";
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
        Shared LineLength;
        Shared Line;
        Shared c2;
        Shared fdout;

        Pause

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
                    puts "Assembler after thePrinter, Detaching..."
                    #Detach; # back to main program
                    Resume Main; # really back to main
                }
                puts "Assembler before theSquasher"
                Resume theSquasher;
            }
            Resume thePrinter;
        }
    }

    proc Printer {} {
        Shared LineLength;
        Shared Line;
        Shared fdout;

        Pause

        while {"True"} {
            for {set i 0} {$i < $LineLength} {incr i} {
                puts stdout "Printer char='[lindex $Line $i]'"
                puts -nonewline $fdout [lindex $Line $i]
            }

            puts $fdout " ";
            Resume theAssembler;
        }
    }

    proc MainCoroutine {} {
        Shared fdin  [open infile.txt r]
        Shared fdout [open outfile.txt w+]
        puts $fdout "Starting output"
        puts stdout "...starting in Main"

        Resume theDisassembler;

        puts stdout "...finished with Main (This statement is never reached with Detach)"
    }

    coroutine theReader Reader;
    coroutine theDisassembler Disassembler;
    coroutine theSquasher Squasher;
    coroutine theAssembler Assembler;
    coroutine thePrinter Printer;
    coroutine Main MainCoroutine;

    puts "Finished running Main..."
    flush $fdout
    close $fdout
    close $fdin
}
