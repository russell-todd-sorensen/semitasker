


set url [ns_conn url]
set splitUrl [split $url /]
set requestedFile [lindex $splitUrl end]
set urlDirectory [join [lrange $splitUrl 0 end-1] /]
set directory [ns_normalizepath $urlDirectory]/
set pageroot [ns_info pageroot]
set absolutePath [file join $pageroot [string trimleft $directory /]]/
ns_log Notice "absolutePath='$absolutePath' dir='[file dirname $absolutePath]'"
set dataDirectory [file join [file dirname $absolutePath] website-data data]
ns_log Notice "dataDirector='$dataDirectory'"
set iifFile [file join $dataDirectory "EVERYTHING.IIF"]
set patternList [split $requestedFile ".-_ "]
set firstPattern "*[lindex $patternList 0]*"
set matchedFiles [list]
set matchingFileList [list]
set statsHtml [list]
set exceptionList [list]


set fd [open $iifFile r ]
set data [chan read $fd]
close $fd
set data [string map {\t ,} $data]

set csvFileName "hom-invoices-january-2018-temp.csv"

set fdout [open [file join $dataDirectory $csvFileName] w+]
puts -nonewline $fdout $data
chan seek $fdout 0
set dataFound 0

set dataArrayList [list]
set invoiceLines [list]

while {[set cols [ns_getcsv $fdout line]] > -1} {

    set continue 0
    set type [lindex $line 0]

    if {[string match "!?*" "$type"]} {
        if {![string match "!END?*" "$type"]} {
            set type [string range $type 1 end]
            set nameList($type) $line
            set arrayIndex($type) 0
            lappend dataArrayList $type
        } else {
            continue
        }
    } elseif {[string match "END?*" "$type"]} {
        continue
    } else {
        # append data
        set currentName "-"
        foreach name $nameList($type) value $line {

            if {("$name" eq "HIDDEN") && ("$value" eq "Y")} {
                set continue 1
                ns_log Notice "************ $type $value"
                unset ${type}$arrayIndex($type)
                if {[info exists ${type}($currentName)]} {
                    unset ${type}($currentName)
                }
                if {[info exists ${type}Index($currentName)]} {
                    unset ${type}Index($currentName)
                }
                break
            }

            if {"$name" eq "NAME"} {
                set currentName $value
                set ${type}($value) $line
                set ${type}Index($value) $arrayIndex($type)
            }
            set ${type}$arrayIndex($type)($name) $value
        }

        if {"$continue"} {
            continue
        }

        set ${type}Array($arrayIndex($type)) ${type}$arrayIndex($type)
        incr arrayIndex($type)
    }
}

set table "<table id='customers' cellspacing='0' cellpadding='3' border='1'>"

append table "\n</table>"

set data ""
set arriveField "JOBSTART"
set endField    "JOBEND"
set companyField "COMPANYNAME"
set houseField  "CUSTFLD5"
set dobField    "JOBPROJEND"
set docField    "CUSTFLD6"
set ccoField    "CUSTFLD8"
set sotpField   "CUSTFLD9"
set firstNameField "FIRSTNAME"
set lastNameField "LASTNAME"
set ctypeField  "CTYPEX" ;# CTYPEX
set termsField  "TERMSX"
set emailField  "EMAIL"
set addrNameField "BADDR1"
set refnumField "REFNUM"
set nameField   "NAME"
set jobtypeField "JOBTYPEX"
set typeField   "!CUST"
set pricelevelField "PRICELEVELX"

set nameList2(CUST) [string map [list CTYPE $ctypeField TERMS $termsField JOBTYPE $jobtypeField PRICELEVEL $pricelevelField] $nameList(CUST)]

set invoiceLines [list]

ns_log Error "UPDATE voucher-gen-improved.tcl with the CLASS of each invoice"
error "UPDATE INVOICE WITH CLASS"
return -code return

set invoiceHeader1 [split [string map {\t ,} "!HDR	PROD	VER	REL	IIFVER	DATE	TIME	ACCNTNT	ACCNTNTSPLITTIME"] ,]
set invoiceHeader2 [split [string map {\t ,} "HDR	QuickBooks Desktop Pro	Version 27.0D	Release R5P	1	2017-07-29	1501191278	N	0"] ,]
set invoiceHeader3 [split [string map {\t ,} "!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT	NAMEISTAXABLE	ADDR1	ADDR2	ADDR3	ADDR4	ADDR5	DUEDATE	TERMS	PAID	PAYMETH	SHIPVIA	SHIPDATE	OTHER1"] ,]
set invoiceHeader4 [split [string map {\t ,} "!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY	PRICE	INVITEM	TAXABLE	OTHER2	YEARTODATE	WAGEBASE"] ,]
set invoiceHeader5 [split [string map {\t ,} "!ENDTRNS"] ,]

lappend invoiceLines $invoiceHeader1 $invoiceHeader2 $invoiceHeader3 $invoiceHeader4 $invoiceHeader5

proc programFeePerHouse {house company monthNumber} {
    switch -exact -nocase -- $house {
        Jeremiah - James - Galatians - Philippians {
            set fees 400.00
        }
        Ezra {
            set fees 375.00
        }
        default {
            return 550.00
        }
    }
    if {[string match "*DOC Voucher*" $company]} {
        set fees [programFeeVoucher $house $company $fees $monthNumber]
    }
    return $fees
}

set invoiceDate "01/01/2018"
set monthNumber 1
set month "Jan"
set year "2018"
set invoiceNumber 1
set terms "Due by the 1st of Mo"
ns_log Notice "what is up"

proc programFeeVoucher {house company fees monthNumber} {

	if {[regexp -nocase {(DOC Voucher) (19[0-9][0-9]|20[0-9][0-9])-([0-1][0-9])-([0-2][0-9])} $company all voucher year month day]} {
		set currentMonth $monthNumber
		set month [string trimleft $month "0"]
		set day   [string trimleft $day "0"]
		ns_log Notice "month=$month day=$day year=$year currentMonth=$currentMonth c-m=[expr {$currentMonth-$month < 0}]"
		if {[expr {$currentMonth - $month < 0}]} {
			return 550
		} else {

			set voucherDays $day

			if {$voucherDays == 0 || $voucherDays == 30} {
				return $fees
			}

			set nonVoucherDays [expr {30 - $voucherDays}]
			set voucherRate 18.33333

			switch -exact -nocase -- $house {
				Jeremiah - James - Galatians - Philippians {
					set nonVoucherRate 13.33333
				}
				Ezra {
					set nonVoucherRate 12.50
				}
			}
			set voucherFee [format "%2.2f" [expr {$voucherDays*$voucherRate}]]
			set nonVoucherFee [format "%2.2f" [expr {$nonVoucherDays*$nonVoucherRate}]]
			set fees [format "%2.2f" [expr {$voucherFee + $nonVoucherFee}]]
			return [list $fees [list $voucherDays $voucherRate $voucherFee] [list $nonVoucherDays $nonVoucherRate $nonVoucherFee]]

		}
	}
}

ns_log Notice "what is up again..."
ns_log Notice "{*}$nameList2(CUST)"

foreach participant [lsort [array names CUST]] {
    lassign $CUST($participant) {*}$nameList2(CUST)

    set skipFurtherProcessing 0
    set continue 0
    if {[set $houseField] ne "Office"} {
        set ctype [set $ctypeField]
        set ctype [lindex [split [set $jobtypeField] :] 1]

        if {[lsearch -exact [list "Program Participant" "House Leader" "Assistant House Leader" "Non Transitional Housing"] $ctype] == -1} {
        	ns_log Notice "ctype='$ctype'"
        	continue
        }

        set company [set $companyField]
        set house [set $houseField]
        set splitAccount "Program Fees:Program Fees - $house"
        set memo "$month $year Program Fees"

        set invItem "Program Fee:. $house"

        switch -glob -nocase -- $company {
        	"*NO PROGRAM FEES*" {
        		set fees "0.00"
        		set skipFurtherProcessing 1
        	}
        	"*HOUSE LEADER*" -
        	"*PROGRAM FEES*" {
        		if {[regexp {(.), ([0-9]+)( PROGRAM FEES)} $company all pre fees remain]} {
        			ns_log Notice "!!!!!! company='$company' all='$all' pre='$pre' fees='$fees' remain='$remain'"
        		} else {
        			set fees [programFeePerHouse $house $company $monthNumber]
        		}
        	}
        	"*RENT*"  {
        	    #lappend exceptionList "company='$company'"
        		if {[regexp {([0-9]+)( RENT)} $company all fees remain]} {
        			ns_log Notice "!!!!!! company='$company' all='$all' pre='$pre' fees='$fees' remain-'$remain'"
        		} else {
        			set fees [programFeePerHouse $house $company $monthNumber]
        		}
        		lappend exceptionList "RENT=$fees for '[set $nameField]'"
        	}
        	"*DOC VOUCHER*" {
        	    if {[regexp -nocase {(DOC Voucher) (19[0-9][0-9]|20[0-9][0-9])-([0-1][0-9])-([0-2][0-9])} $company allX voucherX yearX monthX dayX]} {
        	        set currentMonth $monthNumber
        	        set monthX [string trimleft $monthX "0"]
        	        set dayX   [string trimleft $dayX "0"]
        	        
        	        ns_log Notice "month=$monthX day=$dayX year=$yearX currentMonth=$currentMonth c-m=[expr {$currentMonth-$monthX < 0}]"
        	        if {$monthX >= 10 || $yearX == 2018} {
        	            set skipFurtherProcessing 1
        	            set continue 1
        	            lappend exceptionList "[set $nameField] voucher invoice handled elsewhere"
        	        } else {
        	            set fees [programFeePerHouse $house $company $monthNumber ]
        	        }
        	    } else {
        	        set skipFurtherProcessing 1
        	        set continue 1
        	        lappend exceptionList "[set $nameField] malformed Company field"
        	    }
        	}
        	"*SECOND*" {
        		#set fees [programFeeSecondChance $house $company]
        		set fees "500"
        	}
        	"" {
        		set fees [programFeePerHouse $house $company $monthNumber]
        	}
	        "*FARESTART*" -
	        "HEN" {
		        set fees [programFeePerHouse $house $company $monthNumber]
	        }
	        "*ELECHA*" -
	        "*ELECCAR*" {
	            set fees [programFeePerHouse $house $company $monthNumber]
	        }
        	default {
        		lappend exceptionList "[set $nameField] not handled"
        		set skipFurtherProcessing 1
        		set continue 1
        	}
        }

        if {$continue} {
        	continue
        }
        if {$skipFurtherProcessing} {
        	continue
        }
        set feeList [list]

        if {[llength $fees] > 1} {
        	# multiple split lines
        	set feeList $fees
        	set fees [lindex $feeList 0]
        }
        set fees [format %2.2f $fees]
        set fInvNumber "$month-[format %0.4d $invoiceNumber]"
        lappend invoiceLines [list TRNS "" INVOICE $invoiceDate "Accounts Receivable" [set $nameField] "" $fees $fInvNumber $memo N Y N "$FIRSTNAME $LASTNAME" "$BADDR2" "$BADDR3" "$BADDR4" "" "$invoiceDate" "$terms" "Unpaid" "" "" $invoiceDate ""]
        incr invoiceNumber
	    
        set houseAccountName $house

        if {[llength $feeList] == 0} {
            if {[set $ctypeField] eq "Non Transitional Housing"} {
                set invItem "Rent"
                set invAcct "Rental Fees Non Transitional"
                set memo    "$month $year Rent"
            } else {
                set invAcct "Program Fees:Program Fees - $houseAccountName"
                set invItem "Program Fee:. $houseAccountName"
            }
	    
            lappend invoiceLines [list SPL "" INVOICE $invoiceDate "$invAcct" "" "" -$fees "" "$memo" N -1 $fees "$invItem" N "" 0 0]
        } else {
        	set voucherList [lindex $feeList 1]
        	set nonVoucherList [lindex $feeList 2]
	        set voucherInvItem "Pro-Rated Program Fees:. $houseAccountName Voucher"
	        set nonVoucherInvItem "Pro-Rated Program Fees:. $houseAccountName"
	        set invAcct "Program Fees:Program Fees - $houseAccountName"

        	lappend invoiceLines [list SPL	"" INVOICE $invoiceDate $invAcct "" "" -[lindex $voucherList 2] "" "Program Fee per day @ [lindex $voucherList 1]" N -[lindex $voucherList 0] [lindex $voucherList 1] $voucherInvItem N "" 0 0]
        	lappend invoiceLines [list SPL	"" INVOICE $invoiceDate $invAcct "" "" -[lindex $nonVoucherList 2] "" "Program Fee per day @ [lindex $nonVoucherList 1]" N -[lindex $nonVoucherList 0] [lindex $nonVoucherList 1] $nonVoucherInvItem N "" 0 0]
       }
       lappend invoiceLines [list ENDTRNS]

       append data "[set $nameField] company='[set $companyField]' ctype='[set $ctypeField]' --FEE: $fees - \n"
    }
}

set iifFile ""
foreach dataLine $invoiceLines {
	append iifFile [join $dataLine \t]\n
}

set finalIIFfileName "invoices-final-january.iif"

set fdout2 [open [file join $dataDirectory $finalIIFfileName] w+]
puts -nonewline $fdout2 $iifFile
close $fdout2

close $fdout

ns_return 200 text/html "
<!DOCTYPE html>
<html lang='en_US'>
<head>
<meta name='lang' value='UTF-8'/>
<style>
#customers {
    border: 1px solid black;
    border-collapse: collapse;

}

</style>
</head>
<body>
<pre>
url='$url'
directory='$directory'
absolutePath='$absolutePath'
dataDirectory='$dataDirectory'
exceptionList=[join $exceptionList \n]
</pre>
<pre>
$iifFile
</pre>
</html>"
