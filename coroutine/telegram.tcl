source coroutine-library.tcl;

namespace eval ::Telegram {

    variable Word "";
    variable Letter "";
    variable inFileFd [open telegrams.txt r];
    variable outFileFd [open telegram-out.txt w+];

    proc LetterProducer {} {
        variable Letter;
        variable inFileFd;

        Detach;

        while {"True"} {
            set Letter [read $inFileFd 1]
            if {"$Letter" eq "\n"} {
                set Letter " ";
            } elseif {"$Letter" eq ""} {
                Resume theCleaner;
            }
            puts "Letter = '$Letter'"
            Resume theWordProducer;
        }
    }

    proc WordProducer {} {
        variable Letter;
        variable Word;

        Detach;

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
                puts "Word = '$Word'";
                set Word $NextWord;
            }
        }
    }

    proc Cleaner {} {

        variable outFileFd;
        variable inFileFd;

        Detach;

        puts stdout "EOF!!"
        flush $outFileFd;
        close $outFileFd;
        close $inFileFd;

        Detach;
    }

    proc Printer {} {
         variable Word;
         variable outFileFd;

         set LineLength 0;

         Detach;

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

    proc TelegramFilter {} {
        coroutine theLetterProducer LetterProducer;
        coroutine theWordProducer WordProducer;
        coroutine thePrinter Printer;
        coroutine theCleaner Cleaner;
        Resume theLetterProducer;

    }

    coroutine theTelegramFilter TelegramFilter;
}
