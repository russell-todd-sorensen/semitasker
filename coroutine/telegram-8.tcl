source coroutine-library.tcl;

namespace eval ::Telegram {
    Shared Word "";
    Shared Letter "";
    proc LetterProducer {} {
        Shared Letter;
        Shared inFileFd;
        Shared errFileFd;

        Pause;

        while {"True"} {
            set Letter [read $inFileFd 1]
            if {"$Letter" eq "\n"} {
                set Letter " ";
            } elseif {"$Letter" eq ""} {
                Resume theCleaner;
            }
            puts $errFileFd "Letter = '$Letter'"
            Resume theWordProducer;
        }
    }

    proc WordProducer {} {
        Shared Letter;
        Shared Word;
        Shared errFileFd;

        Pause;
        puts "namespace=[namespace current]"
        while {"True"} {
            while {"$Letter" eq " "} {
                Resume theLetterProducer;
            }
            set NextWord "";
            while {"True"} {
                set NextLetter $Letter;
                append NextWord $NextLetter;
                Resume theLetterProducer;
                if {"$Letter" eq " "} {break}
            }
            if {"$NextWord" eq "STOP"} {
                append Word ".";
            } else {
                if {[string length $Word] > 0} {
                    Resume thePrinter;
                }
                if {"$Word" eq "ZZZZ"
                    &&  "$NextWord" eq "ZZZZ"
                } {
                    Resume theCleaner;
                }
                puts $errFileFd "Word = '$Word'";
                set Word $NextWord;
            }
        }
    }

    proc Cleaner {} {

        Shared outFileFd;
        Shared inFileFd;
        Shared errFileFd;

        Pause;

        puts  $errFileFd "EOF!!";

        flush $outFileFd;
        flush $errFileFd;

        close $outFileFd;
        close $inFileFd;
        close $errFileFd;

        Detach;
    }

    proc Printer {} {
         Shared Word;
         Shared outFileFd;

         set LineLength 0;

         Pause;

         while {"True"} {
             while {"$Word" ne "ZZZZ"} {
                 if {[expr {$LineLength + [string length $Word]}] > 20} {
                     puts -nonewline $outFileFd "\n";
                     set LineLength 0;
                 }
                 puts -nonewline $outFileFd "$Word ";
                 flush $outFileFd
                 incr LineLength [string length $Word];
                 incr LineLength;
                 Resume theWordProducer;
             }
             puts -nonewline $outFileFd "\n\n";
             set LineLength 0
             Resume theWordProducer;
         }
    }

    proc TelegramFilter {{inFile stdin} {outFile stdout} {errFile stderr}} {
        Shared inFileFd
        Shared outFileFd
        Shared errFileFd

        if {"$inFile" eq "stdin" || ![file readable $inFile.txt]} {
            set inFileFd "stdin"
        } else {
            set inFileFd [open $inFile.txt r];
        }
        if {"$outFile" eq "stdout" || [file exists $outFile.txt] } {
            set outFileId "stdout"
        } else {
            set outFileFd [open $outFile.txt {CREAT EXCL RDWR} ];
        }
        if {"$errFile" eq "stderr"} {
            set errFileFd stderr
        } else {
            set time [clock seconds]
            set errFileFd [open err/$errFile-$time.log w+]
            puts $errFileFd "Error File Open..."
        }

        Coro theLetterProducer LetterProducer;
        Coro theWordProducer WordProducer;
        Coro thePrinter Printer;
        Coro theCleaner Cleaner;
        Resume theLetterProducer;

    }

    # Sequencing TelegramFilter;

}

# Sequencing ::Telegram::TelegramFilter;
# Run by entering the above call --^
# Identical result try this --v (id 'Main' could be any unique word)
# coroutine Main ::Telegram::TelegramFilter
