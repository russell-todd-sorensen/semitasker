set url [ns_conn url]
set splitUrl [split $url /]
set requestedFile [lindex $splitUrl end]
set urlDirectory [join [lrange $splitUrl 0 end-1] /]
set directory [ns_normalizepath $urlDirectory]/
set pageroot [ns_info pageroot]
set absolutePath [file join $pageroot [string trimleft $directory /]]/
ns_log Notice "absolutePath='$absolutePath' dir='[file dirname $absolutePath]'"
set dataDirectory [file join [file dirname $absolutePath] website-data data]
set outputDataDirectory [file join $dataDirectory var]
ns_log Notice "dataDirector='$dataDirectory'"
ns_log Notice "outputDataDirectory='$outputDataDirectory'"
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

set csvFileName "hom-invoices-april-2019-temp.csv"

set propertyOwnerFileName "property-owners-to-houses-map.csv"
set pfd [open [file join $dataDirectory $propertyOwnerFileName] r]

set pcount -1
set pnames [list]

while {[set cols [ns_getcsv $pfd line]] > -1} {
	incr pcount
	if {$pcount == 0} {
		set pnames $line
		set keyIndex [lsearch $pnames house]
		continue
	}
	set arrayAsList [list]
	set key [lindex $line $keyIndex]
	foreach nam $pnames val $line {
		lappend arrayAsList $nam $val
	}
	set House($key) $arrayAsList
}

close $pfd


set fdout [open [file join $outputDataDirectory $csvFileName] w+]
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
        set currentHouse ""
        set foundHouseField 0

        foreach name $nameList($type) value $line {

            if {("$name" eq "HIDDEN") && ("$value" eq "Y")} {
                set continue 1
                #ns_log Notice "************ $type $value"
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
                #set ${type}($value) $line
                #set ${type}Index($value) $arrayIndex($type)
            }
            if {"$type" eq "CUST" && "$name" eq "CUSTFLD5"} {
            	ns_log Notice "CUSTFLD5 = '$value'"
            	set currentHouse $value
            	set foundHouseField 1
            }
            set ${type}$arrayIndex($type)($name) $value
        }

        if {"$continue"} {
            continue
        }

        if {"$type" eq "CUST" && "$foundHouseField" == 1} {
        	set wholeName "$currentHouse -- $currentName"
        	ns_log Notice "WholeName = '$wholeName'"
        	set ${type}($wholeName) $line
        	set ${type}Index($wholeName) $arrayIndex($type)
        } else {
        	 set ${type}($currentName) $line
             set ${type}Index($currentName) $arrayIndex($type)
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
set salestaxcodeField "SALESTAXCODEX"

set nameList2(CUST) [string map [list CTYPE $ctypeField TERMS $termsField JOBTYPE $jobtypeField PRICELEVEL $pricelevelField SALESTAXCODE $salestaxcodeField] $nameList(CUST)]

set invoiceLines [list]

#ns_log Error "UPDATE voucher-gen-improved.tcl with the CLASS of each invoice"
#error "UPDATE INVOICE WITH CLASS"
#return -code return

set invoiceHeader1 [split [string map {\t ,} "!HDR	PROD	VER	REL	IIFVER	DATE	TIME	ACCNTNT	ACCNTNTSPLITTIME"] ,]
set invoiceHeader2 [split [string map {\t ,} "HDR	QuickBooks Desktop Pro	Version 27.0D	Release R5P	1	2017-07-29	1501191278	N	0"] ,]
set invoiceHeader3 [split [string map {\t ,} "!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT	NAMEISTAXABLE	ADDR1	ADDR2	ADDR3	ADDR4	ADDR5	DUEDATE	TERMS	PAID	PAYMETH	SHIPVIA	SHIPDATE	OTHER1"] ,]
set invoiceHeader4 [split [string map {\t ,} "!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY	PRICE	INVITEM	TAXABLE	OTHER2	YEARTODATE	WAGEBASE"] ,]
set invoiceHeader5 [split [string map {\t ,} "!ENDTRNS"] ,]

lappend invoiceLines $invoiceHeader1 $invoiceHeader2 $invoiceHeader3 $invoiceHeader4 $invoiceHeader5

proc programFeePerHouse {house company monthNumber} {
    switch -exact -nocase -- $house {
        Jeremiah - James - Galatians - Philippians {
            set fees 450.00
        }
        Ezra - "1 Kings" {
            set fees 400.00
        }
        default {
            set fees 600.00
        }
    }
    if {[string match "*DOC Voucher*" $company]} {
        set fees [programFeeVoucher $house $company $fees $monthNumber]
    }
    return $fees
}

proc classForHouse {house} {
	switch -exact -nocase -- $house {
        Jeremiah - James - Galatians - Philippians {
            set CLASS "Spokane County"
            set REFNUM 1
        }
        Ezra - "1 Kings" {
            set CLASS "Yakima County"
            set REFNUM 4
        }
        John {
        	set CLASS "Pierce County"
        	set REFNUM 3
        }
        Exodus {
        	set CLASS "Whatcom County"
        	set REFNUM 5
        }
        default {
            set CLASS "King County"
            set REFNUM 2
        }
    }
	return [list $CLASS $REFNUM]
}

set invoiceDate "04/01/2019"
set monthNumber 4
set monthFormatted "04"
set month "Apr"
set monthFull "April"
set year "2019"
set shortYear "19"
set invoiceNumber 1
set terms "Due by the 1st of Mo"

proc programFeeVoucher {house company fees monthNumber} {

	if {[regexp -nocase {(DOC Voucher) (19[0-9][0-9]|20[0-9][0-9])-([0-1][0-9])-([0-2][0-9])} $company all voucher year month day]} {
		set currentMonth $monthNumber
		set month [string trimleft $month "0"]
		set day   [string trimleft $day "0"]
		ns_log Notice "month=$month day=$day year=$year currentMonth=$currentMonth c-m=[expr {$currentMonth-$month < 0}]"
		if {[expr {$currentMonth - $month < 0}]} {
			return 600
		} else {

			set voucherDays $day

			if {$voucherDays == 0 || $voucherDays == 30} {
				return $fees
			}

			set nonVoucherDays [expr {30 - $voucherDays}]
			set voucherRate 16.66667

			switch -exact -nocase -- $house {
				Jeremiah - James - Galatians - Philippians {
					set nonVoucherRate 15.00
				}
				Ezra - "1 Kings" {
					set nonVoucherRate 13.33333
				}
			}
			set voucherFee [format "%2.2f" [expr {$voucherDays*$voucherRate}]]
			set nonVoucherFee [format "%2.2f" [expr {$nonVoucherDays*$nonVoucherRate}]]
			set fees [format "%2.2f" [expr {$voucherFee + $nonVoucherFee}]]
			return [list $fees [list $voucherDays $voucherRate $voucherFee] [list $nonVoucherDays $nonVoucherRate $nonVoucherFee]]

		}
	}
}

proc get_gl_account_list {houseArrayName house ctype} {
	upvar 1 $houseArrayName houses
	if {[info exists houses($house)]} {
		array set myHouse $houses($house)
	} else {
		ns_log Error "Houses($house) does not exist..."
		return
	}
	set owner $myHouse(owner)
	set property $myHouse(property)
	set account [list]
	set invitem ""
	set memo ""
	if {$ctype == "Non Transitional Housing"} {
		lappend account "Rental Fees Non Transitional"
		set invitem [join [list Rent $myHouse(invitem)] :]
		set memo_end "Rent"
	} else {
		lappend account "Program Fees"
		set invitem [join [list "Program Fee" ". $myHouse(invitem)"] :]
		set memo_end "Program Fees"
	}
	if {$property > 0} {
		lappend account "$owner Properties"
		#lappend account "$house House"
		lappend account "$myHouse(invitem) House"
	} else {
		#lappend account "$house House"
		lappend account "$myHouse(invitem) House"
	}
	set fullAccount [join $account :]
	return [list $fullAccount $invitem $memo_end]
}

ns_log Notice "what is up again..."
ns_log Notice "{*}$nameList2(CUST)+++++++++++++++++++++++++"
ns_log Notice "[join [lsort [array names CUST]] \n]"

foreach participant [lsort [array names CUST]] {
    lassign $CUST($participant) {*}$nameList2(CUST)
    ns_log Notice "---->>>$participant"
    set skipFurtherProcessing 0
    set continue 0
    if {[set $houseField] ne "Office"} {
        set ctype [set $ctypeField]
        set ctype [lindex [split [set $jobtypeField] :] 1]
        if {"$ctype" eq "Staff"} {
        	set ctype [lindex [split [set $jobtypeField] :] 2]
        }
        if {[lsearch -exact [list "Program Participant" "House Leader" "Assistant House Leader" "Non Transitional Housing"] $ctype] == -1} {
        	ns_log Notice "ctype='$ctype'"
        	continue
        }

        set company [set $companyField]
        set house [set $houseField]
        if {![info exists House($house)]} {
        	lappend exceptionList "<b style='color:red'>[set $nameField]</b> not handled House $house not mapped."
        	continue
        }

        #set splitAccount "Program Fees:Program Fees - $house"
        set account_list [get_gl_account_list House $house $ctype]
        set splitAccount [lindex $account_list 0]
        set memo_end [lindex $account_list 2]
        set inv_item [lindex $account_list 1]

        set memo "$month $year $memo_end"

        #set invItem "Program Fee:. $house"
        set invItem $inv_item

        switch -glob -nocase -- $company {
        	"*NO PROGRAM FEES*" {
        		set fees "0.00"
        		lappend exceptionList "[set $nameField]: <b>No Program Fees</b> data='$company'"
        		set skipFurtherProcessing 1
        	}
        	"*PROGRAM FEES*" {
        		if {[regexp {(.*), ([0-9]+)( PROGRAM FEES)} $company all pre fees remain]} {
        			ns_log Notice "!!!!!! company='$company' all='$all' pre='$pre' fees='$fees' remain='$remain'"
        		} elseif {[regexp {([0-9]+)( PROGRAM FEES)} $company all fees remain]} {
        			lappend exceptionList "[set $nameField]: <b class='override'>OVERRIDE</b> fees='$fees' data='$company'"
        		} else {
        			set fees [programFeePerHouse $house $company $monthNumber]
        			lappend exceptionList "[set $nameField]: <b class='warning'>WARNING CHECK</b> fees='$fees' data='$company'"
        		}
        	}
        	"*RENT*"  {
        	    #lappend exceptionList "company='$company'"
        		if {[regexp {([0-9]+)( RENT)} $company all fees remain]} {
        			ns_log Notice "!!!!!! company='$company' all='$all' fees='$fees' remain-'$remain'"
        		} else {
        			set fees [programFeePerHouse $house $company $monthNumber]
        		}
        		lappend exceptionList "[set $nameField] RENT=$fees data='$company'"
        	}
        	"*DOC VOUCHER*" {
        	    if {[regexp -nocase {(DOC Voucher) (19[0-9][0-9]|20[0-9][0-9])-([0-1][0-9])-([0-3][0-9])} $company allX voucherX yearX monthX dayX]} {
        	        set currentMonth $monthNumber
        	        set monthX [string trimleft $monthX "0"]
        	        set dayX   [string trimleft $dayX "0"]

        	        ns_log Notice "month=$monthX day=$dayX year=$yearX currentMonth=$currentMonth c-m=[expr {$currentMonth-$monthX < 0}]"
        	        if {$yearX > 2017} {
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
	        "*FARESTART*" -
	        "HEN" -
	        "RISE" -
	        "*ELECHA*" -
	        "*ELECCAR*" -
	        "" {
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
        set fInvNumber "$shortYear$monthFormatted-[format %0.4d $invoiceNumber]"
        set classList [classForHouse $house]
        set className [lindex $classList 0]
        set classRefnum [lindex $classList 1]

        lappend invoiceLines [list TRNS "" INVOICE $invoiceDate "Accounts Receivable" [set $nameField] "$className" $fees $fInvNumber $memo N Y N "$FIRSTNAME $LASTNAME" "$BADDR2" "$BADDR3" "$BADDR4" "" "$invoiceDate" "$terms" "Unpaid" "" "" $invoiceDate ""]
        incr invoiceNumber
        set houseAccountName $house

        if {[llength $feeList] == 0} {
            if {[set $jobtypeField] eq "Program Status:Non Transitional Housing"} {
                #set invItem "Rent"
                #set invAcct "Rental Fees Non Transitional"
                #set memo    "$month $year Rent"
            } else {
                #set invAcct "Program Fees:Program Fees - $houseAccountName"
                #set invItem "Program Fee:. $houseAccountName"
            }
            set invAcct $splitAccount

            lappend invoiceLines [list SPL "" INVOICE $invoiceDate "$invAcct" "" "$className" -$fees "" "$memo" N -1 $fees "$invItem" N "" 0 0]
        } else {
        	set voucherList [lindex $feeList 1]
        	set nonVoucherList [lindex $feeList 2]
	        set voucherInvItem "Pro-Rated Program Fees:. $houseAccountName Voucher"
	        set nonVoucherInvItem "Pro-Rated Program Fees:. $houseAccountName"
	        set invAcct "Program Fees:Program Fees - $houseAccountName"

        	lappend invoiceLines [list SPL	"" INVOICE $invoiceDate $invAcct "" "$className" -[lindex $voucherList 2] "" "Program Fee per day @ [lindex $voucherList 1]" N -[lindex $voucherList 0] [lindex $voucherList 1] $voucherInvItem N "" 0 0]
        	lappend invoiceLines [list SPL	"" INVOICE $invoiceDate $invAcct "" "$className" -[lindex $nonVoucherList 2] "" "Program Fee per day @ [lindex $nonVoucherList 1]" N -[lindex $nonVoucherList 0] [lindex $nonVoucherList 1] $nonVoucherInvItem N "" 0 0]
       }
       lappend invoiceLines [list ENDTRNS]

       append data "[set $nameField] company='[set $companyField]' ctype='[set $ctypeField]' --FEE: $fees - \n"
    }
}

set iifFile ""
foreach dataLine $invoiceLines {
	append iifFile [join $dataLine \t]\n
}

set finalIIFfileName "invoices-final-[string tolower $monthFull]-${year}.iif"

set fdout2 [open [file join $outputDataDirectory $finalIIFfileName] w+]
puts -nonewline $fdout2 $iifFile
close $fdout2
close $fdout

set prop_owner_format "\n%7.7s%15.15s%15.15s%15.15s%10.10s"

set property_owners_data "\n[format $prop_owner_format Account House Owner InvItem Property]"
foreach hs [lsort [array names House]] {
	array unset tmpArray
	array set tmpArray $House($hs)
	append property_owners_data "[format $prop_owner_format $tmpArray(accnt) $tmpArray(house) $tmpArray(owner) $tmpArray(invitem) $tmpArray(property)]"
}

ns_return 200 text/html "<!DOCTYPE html>
<html lang='en-US'>
<head>
<meta name='lang' value='UTF-8'/>
<style>
#customers {
    border: 1px solid black;
    border-collapse: collapse;

}
.warning {
	color: red;
}
.override {
	color: yellow;
	background-color: black;
}

</style>
</head>
<body>
<pre>
url='$url'
directory='$directory'
absolutePath='$absolutePath'
dataDirectory='$dataDirectory'
outputDataDirectory='$outputDataDirectory'
property_owner_data=$property_owners_data
exceptionList=
[join $exceptionList \n]
</pre>
<pre>
$iifFile
</pre>
</html>"
