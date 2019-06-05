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
ns_log Notice "outputDataDirector='$outputDataDirectory'"
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

set csvFileName "hom-covenant-eyes-june-2019-temp.csv"

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


set ceInvoiceFileName "ce-invoices-june-2019.csv"
set cfd [open [file join $outputDataDirectory $ceInvoiceFileName] r]

set cOutputList [list]
set cExceptionList [list]

set ccount -1
set cnames [list]

proc formatDate {input} {
	set format "%b. %dth, %Y"
	set tmp [clock format [clock scan $input] -format $format]
	return [string map [list May. May " 01th" " 1st" " 02th" " 2nd" " 03th" " 3rd" " 04" " 4" " 05" " 5" " 06" " 6" " 07" " 7" " 08" " 8" " 09" " 9"] $tmp]
}

if {[array exists userNameArray]} {
	array unset userNameArray
}

while {[set cols [ns_getcsv $cfd line]] > -1} {
	incr ccount
	if {"$cols" == 5} { #good

	} else { #decide what to do
		ns_log Notice "Malformed Col ${ccount}: '$line'"
	}
	if {[string match "*Accountability Adjustment*" [lindex $line 0]]} {
		#accountability line
		set aData [lindex $line 0]
		set aD1 [string map {" - " % " to " %} $aData]
		set aList [split $aD1 %]
		set loginName [lindex $aList 0]
		set chargeType [lindex $aList 1]
		set startDate [lindex $aList 2]
		set endDate [lindex $aList 3]
		set charge [string trimleft [lindex $line 4] $]
		set outputLine [list ($loginName) $chargeType "[formatDate $startDate] - [formatDate $endDate]" \$$charge]
		if {[info exists userNameArray($loginName)]} {
			set homName $userNameArray($loginName)
			lappend cOutputList $homName,[join $outputLine ,],Adjustment
			lappend qbName($homName) [concat [string trim $homName "\""] $outputLine Adjustment]
			lappend ceName($loginName) [concat [string trim $homName "\""] $outputLine Adjustment]
		} else {
			set homName "No Name Found"
			lappend cExceptionList $homName,[join $outputLine ,],Adjustment
		}
	} elseif {[regexp {(Accountability|Filter)( )(Monthly)} [lindex $line 2] match type ]} {
		set fullname [lindex $line 0]
		set splitName [split $fullname]
		set homName "\"[lindex $splitName end], [join [lrange $splitName 0 end-1] " "]\""
		set loginName [string trim [lindex $line 1] ()]
		set userNameArray($loginName) $homName
		lappend cOutputList $homName,[join [lrange $line 1 end] ,],$type
		lappend qbName($homName) [concat [string trim $homName "\""] [lrange $line 1 end] $type]
		lappend ceName($loginName) [concat [string trim $homName "\""] [lrange $line 1 end] $type]
	}

}


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
set ceField "CUSTFLD10"
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
        Ezra {
            set fees 400.00
        }
        default {
            return 600.00
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
        Exodus - Job {
        	set CLASS "Whatcom County"
        	set REFNUM 5
        }
        David {
        	set CLASS "Clark County"
        	set REFNUM 6
        }
        default {
            set CLASS "King County"
            set REFNUM 2
        }
    }
	return [list $CLASS $REFNUM]
}

set invoiceDate "06/01/2019"
set monthNumber "06"
set month "Jun"
set monthFull "June"
set year "2019"
set shortYear "19"
set invoiceNumber 1
set terms "Due by the 1st of Mo"
set number_of_months "2"
set month_fee "5.00"

set item_description "Subscription from June 5 2019 to July 5 2019"
set memo $item_description

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
		lappend account "$house House"
	} else {
		lappend account "$house House"
	}
	set fullAccount [join $account :]
	return [list $fullAccount $invitem $memo_end]
}



ns_log Notice "what is up again..."
ns_log Notice "{*}$nameList2(CUST)"

foreach participant [lsort [array names CUST]] {
    lassign $CUST($participant) {*}$nameList2(CUST)

    set quotedParticipant "\"$participant\"";#ok
    set ceData [set $ceField]

    if {![info exists qbName($quotedParticipant)]} {
    	if {"$ceData" ne ""} {
    		set ceDataList [split $ceData ,]
    		set ceLoginName [string trim [lindex $ceDataList 0] ()]
    		if {[info exists ceName($ceLoginName)]} {
    			set qbName($quotedParticipant) $ceName($ceLoginName)
    		} else {
    			lappend cExceptionList "No charges for $participant name not found in CE or QB for $ceLoginName"
    			continue
    		}
    	} else {
    		lappend cExceptionList "No charges for $participant name not found in CE"
    		continue
    	}
    }

    if {"$ceData" ne ""} {
    	set ceDataList [split $ceData ,]
    	if {[lindex $ceDataList end] eq "0"} {
    		lappend noChargesList "$participant Zero in CE Field [join $qbName($quotedParticipant) "\n    "]"
    		unset qbName($quotedParticipant)
    		continue
    	}

    } else {
    	lappend noChargesList "$participant Empty CE Field [join $qbName($quotedParticipant) "\n    "]"
    	unset qbName($quotedParticipant)
    	continue
    }

    set skipFurtherProcessing 0
    set continue 0
    if {1} {
        set ctype [set $ctypeField]
        set jobType [lindex [split [set $jobtypeField] :] 1]

        set company [set $companyField]
        set house [set $houseField]
        if {![info exists House($house)]} {
        	lappend exceptionList "<b style='color:red'>[set $nameField]</b> not handled House $house not mapped."
        	continue
        }

        set account_list [get_gl_account_list House $house $ctype]
        set splitAccount [lindex $account_list 0]
        set memo_end [lindex $account_list 2]
        set inv_item [lindex $account_list 1]

        set memo $memo
        set splitAccount "Communications Expense:Accountable2You"

        set invAcct $splitAccount
        set invItem "Accountable2You"

        set itemLines [list]
        set invoiceTotal 0.00
        foreach item $qbName($quotedParticipant) {
        	set ceyesType [lindex $item end]
        	set ceyesName [lindex $item 2]
        	set ceyesCharge [lindex $item end-1]
        	set ceyesMemo [lindex $item end-2]

        	if {"$ceyesType" eq "Adjustment" || "$ceyesType" eq "Accountability"} {
        		set fees 5.00
        	} else {
        		set fees 2.50
        	}

        	set fInvNumber "$shortYear$monthNumber-ce[format %0.4d $invoiceNumber]"
        	set classList [classForHouse $house]
        	set className [lindex $classList 0]
        	set classRefnum [lindex $classList 1]

        	lappend itemLines [list SPL "\"\"" INVOICE "\"$invoiceDate\"" "\"$invAcct\"" "\"\"" "\"$className\"" "\"-$fees\"" "\"\"" "\"$ceyesType $ceyesName $ceyesMemo\"" N -1 $fees "\"$invItem\"" N "\"\"" 0 0]
					lappend itemLines [list SPL "\"\"" INVOICE "\"\"" "\"\"" "\"\"" "\"\"" "\"\"" "\"\"" "\"$ceyesType $ceyesName $ceyesMemo\"" "\"\"" "\"\"" "\"\"" "\"\"" "\"\"" "\"\"" 0 0]

        	set invoiceTotal [expr {$invoiceTotal + $fees}]
        }
        unset qbName($quotedParticipant)
        set invoiceTotal [format %2.2f $invoiceTotal]

        lappend invoiceLines [list TRNS "\"\"" INVOICE "\"$invoiceDate\"" "\"Accounts Receivable\"" "\"[set $nameField]\"" "\"$className\"" "\"$invoiceTotal\"" "\"$fInvNumber\"" "\"Accountable2You\"" N Y N "\"$FIRSTNAME $LASTNAME\"" "\"$BADDR2\"" "\"$BADDR3\"" "\"$BADDR4\"" "\"\"" "\"$invoiceDate\"" "\"$terms\"" "\"Unpaid\"" "\"\"" "\"\"" "\"$invoiceDate\"" "\"\""]

        incr invoiceNumber

        foreach itemLine $itemLines {
        	lappend invoiceLines $itemLine
        }

        lappend invoiceLines [list ENDTRNS]
    }
}

set iifFile ""
foreach dataLine $invoiceLines {
	append iifFile [join $dataLine \t]\n
}

set finalIIFfileName "covenanteyes-invoices-final-[string tolower $monthFull]-${year}.iif"

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

foreach unbilled [lsort [array names qbName]] {
	lappend unbilledList [join $qbName($unbilled) "\n   "]
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
<pre>
[join $cOutputList \n]
</pre>
<pre class='warning'>
Exceptions:
[join $cExceptionList \n]
</pre>
<pre>
Not Billed:
[join $noChargesList \n]
</pre>
<pre>
Remaining Unbilled:
[join $unbilledList \n]
</pre>
</html>"
