source coroutine-library.tcl;

global A B m n CIndex;
set A [list 1 1 2 2 3 5 6 8 15 17];
set B [list 2 4 7 8 8 9 11 13 14 18 20 30];
set A [list 50]
#set B [list -1]
set m [llength $A]
set n [llength $B]

rename Log LogOld
proc Log {args} {

}

namespace eval ::traverser {

    variable C [list]

    proc Traverser {listName Partner} {

        variable C

        upvar 1 $listName List
        set Limit [llength $List]
        set Index 0

        Detach;

        while {$Index < $Limit} {
            set CurrentItem [lindex $List $Index]
            set PartnerItem [Resume $Partner $CurrentItem]

            if {$PartnerItem == -1} {
                for {set i $Index} {$i < $Limit} {incr i} {
                    Log Notice [info coroutine] "Adding    remaining     CurrentItem" = [lindex $List $i]
                    lappend C [lindex $List $i]
                }
                break; # finished
            }

            if {$PartnerItem < $CurrentItem} {
                Log Notice [info coroutine] CurrentItem Less Than PartnerItem Skipping
                continue
            } elseif {$PartnerItem >= $CurrentItem} {
                Log Notice [info coroutine] "Adding equal or smaller CurrentItem" = $CurrentItem
                lappend C $CurrentItem
            }

            incr Index;
        }

        set finalResult [Resume $Partner -1];
        if {$finalResult != -1} {
            Resume $Partner -1
        }
    }


    proc Main {} {
        coroutine PartnerA Traverser A PartnerB
        coroutine PartnerB Traverser B PartnerA

        Resume PartnerB
    }

    coroutine theMainCoroutine Main
    set C
}
