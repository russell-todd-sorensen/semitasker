source coroutine-library.tcl;

namespace eval ::Telegram {
    Shared Word "";
    Shared Letter "";
    Shared inFileFd [open telegrams.txt r];
    Shared outFileFd [open telegram-out.txt w+];

    proc LetterProducer {} {
        Shared Letter;
        Shared inFileFd;

        Pause;

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
        Shared Letter;
        Shared Word;

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
                puts "Word = '$Word'";
                set Word $NextWord;
            }
        }
    }

    proc Cleaner {} {

        Shared outFileFd;
        Shared inFileFd;

        Pause;

        puts stdout "EOF!!"
        flush $outFileFd;
        close $outFileFd;
        close $inFileFd;

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

    proc TelegramFilter {} {
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
