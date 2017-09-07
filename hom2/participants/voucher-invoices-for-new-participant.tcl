set url [ns_conn url]
set splitUrl [split $url /]
set requestedFile [lindex $splitUrl end]
set urlDirectory [join [lrange $splitUrl 0 end-1] /]
set directory [ns_normalizepath $urlDirectory]/
set pageroot [ns_info pageroot]
set absolutePath [file join $pageroot [string trimleft $directory /]]/
set dataDirectory [file join $absolutePath data]/
set iifFile [file join $dataDirectory "EVERYTHING.IIF"]
set patternList [split $requestedFile ".-_ "]
set firstPattern "*[lindex $patternList 0]*"
set matchedFiles [list]
set matchingFileList [list]
set statsHtml [list]
set exceptionList [list]
set ::logText [list]

set fd [open $iifFile r ]
set data [chan read $fd]
close $fd
set data [string map {\t ,} $data]

set csvFileName "everything.csv"

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
            set nameList(TYPE-$type) $line
            set arrayIndex(TYPE-$type) 0
            lappend dataArrayList TYPE-$type
        } else {
            continue
        }
    } elseif {[string match "END?*" "$type"]} {
        continue
    } else {
        # append data
        set currentName "-"
        foreach name $nameList(TYPE-$type) value $line {

            if {("$name" eq "HIDDEN") && ("$value" eq "Y")} {
                set continue 1
                ns_log Notice "************ $type $value"
                unset TYPE-${type}$arrayIndex(TYPE-$type)
                if {[info exists TYPE-${type}($currentName)]} {
                    unset TYPE-${type}($currentName)
                }
                if {[info exists TYPE-${type}Index($currentName)]} {
                    unset TYPE-${type}Index($currentName)
                }
                break
            }

            if {"$name" eq "NAME"} {
                set currentName $value
                set TYPE-${type}($value) $line
                set TYPE-${type}Index($value) $arrayIndex(TYPE-$type)
            }
            set TYPE-${type}$arrayIndex(TYPE-$type)($name) $value
        }

        if {"$continue"} {
            continue
        }

        set TYPE-${type}Array($arrayIndex(TYPE-$type)) TYPE-${type}$arrayIndex(TYPE-$type)
        incr arrayIndex(TYPE-$type)
    }
}

set table "<table id='customers' cellspacing='0' cellpadding='3' border='1'>"

append table "\n</table>"

set data ""
set arriveField "CUSTFLD1"
set endField    "CUSTFLD2"
set companyField "COMPANYNAME"
set houseField  "CUSTFLD5"
set dobField    "CUSTFLD7"
set docField    "CUSTFLD6"
set ccoField    "CUSTFLD8"
set sotpField   "CUSTFLD9"
set firstNameField "FIRSTNAME"
set lastNameField "LASTNAME"
set ctypeField  "CTYPE"
set termsField  "TERMS"
set emailField  "EMAIL"
set addrNameField "BADDR1"
set refnumField "REFNUM"
set nameField   "NAME"
set jobtypeField "JOBTYPE"
set typeField   "!CUST"
set pricelevelField "PRICELEVEL"

set nameList2(TYPE-CUST) [string map [list CTYPE $ctypeField TERMS $termsField JOBTYPE $jobtypeField PRICELEVEL $pricelevelField] $nameList(TYPE-CUST)]

set invoiceLines [list]

set invoiceHeader1 [split [string map {\t ,} "!HDR	PROD	VER	REL	IIFVER	DATE	TIME	ACCNTNT	ACCNTNTSPLITTIME"] ,]
set invoiceHeader2 [split [string map {\t ,} "HDR	QuickBooks Desktop Pro	Version 27.0D	Release R5P	1	2017-07-29	1501191278	N	0"] ,]
set invoiceHeader3 [split [string map {\t ,} "!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT	NAMEISTAXABLE	ADDR1	ADDR3	TERMS	SHIPVIA	SHIPDATE	DUEDATE"] ,]
#set invoiceHeader3 [split [string map {\t ,} "!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	MEMO	CLEAR	TOPRINT	NAMEISTAXABLE	ADDR1	ADDR3	TERMS	SHIPVIA	SHIPDATE"] ,]
set invoiceHeader4 [split [string map {\t ,} "!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY	PRICE	INVITEM	TAXABLE	OTHER2	YEARTODATE	WAGEBASE"] ,]
set invoiceHeader5 [split [string map {\t ,} "!ENDTRNS"] ,]

lappend invoiceLines $invoiceHeader1 $invoiceHeader2 $invoiceHeader3 $invoiceHeader4 $invoiceHeader5

set monthNums [list  1  2  3  4  5  6  7  8  9 10 11 12]
set monthDays [list 31 28 31 30 31 30 31 31 30 31 30 31]
array set ::monthNumToDays {}

foreach num $monthNums dy $monthDays {
    set ::monthNumToDays($num) $dy
}

proc convertMonthYearToDays {month year} {
    switch -exact -- $month {
	"2" {
	    if {($year % 400) == 0} {
		return 29
	    }
	    if {($year % 100) == 0} {
		return 28
	    }
	    if {($year % 4) == 0} {
		return 29
	    }
	    return 28
	}
	default {
	    return $::monthNumToDays($month)
	}
    }
}

proc programFeePerHouse {house company monthNumber} {
    switch -exact -nocase -- $house {
        Jeremiah - James - Galatians - Philippians {
            set fees 400.00
        }
        Ezra {
            set fees 375.00
        }
        default {
            return 500.00
        }
    }
    if {[string match "*DOC Voucher*" $company]} {
        set fees [programFeeVoucher $house $company $fees $monthNumber]
    }
    return $fees
}


set customerName "@Philippians -- Novak, Michael"
set invoiceDate "08/01/2017"
set monthNumber 10
set month "August"
set year "2017"
set invoiceNumber 1
set terms "Due by the 1st of Month"
ns_log Notice "what is up"

proc programFeeVoucher {house company fees monthNumber} {

	if {[regexp -nocase {(DOC Voucher) ([0-1]*[0-9]{1,2})/([0-3]*[0-9]{1,2})/(20[1-2][0-9])} $company all voucher month day year]} {
		set currentMonth $monthNumber
		ns_log Notice "month=$month day=$day year=$year currentMonth=$currentMonth c-m=[expr {$currentMonth-$month < 0}]"
		if {[expr {$currentMonth - $month < 0}]} {
			return 500
		} else {

		    set voucherDays [string trimleft $day]

			if {$voucherDays == 0 || $voucherDays == 30} {
				return $fees
			}

			set nonVoucherDays [expr {30 - $voucherDays}]
			set voucherRate 16.66667

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

proc dateToArray {arrayName date} {
    upvar $arrayName dateArray
    
    set dateSeconds [clock scan $date]
    set dateArray(month) [string trimleft [clock format $dateSeconds -format "%m"] "0"]
    set dateArray(day)  [string trimleft [clock format $dateSeconds -format "%d"] "0"]
    set dateArray(year) [clock format $dateSeconds -format "%Y"]
}

proc invoiceList {house arrivalDate voucherCount} {
    set invoiceADays  0
    set invoiceBDays  0
    set invoiceB      true
    dateToArray voucherStart $arrivalDate

    set daysInMonth [convertMonthYearToDays $voucherStart(month) $voucherStart(year)]
    lappend ::logText "month='$voucherStart(month)', day='$voucherStart(day)', year='$voucherStart(year)' daysInMonth='$daysInMonth'"

    if {"$voucherStart(day)" == 1} {
	set invoiceADays 30
	set invoiceBDays  0
	set invoiceB      false
    } elseif {($voucherStart(day) == $daysInMonth)} {
	set invoiceADays  1
	set invoiceBDays 29
	set invoiceB      true
    } else {
	set invoiceADays [expr {31-$day}]
	set invoiceBDays [expr {30-$invoiceADays}]
	set invoiceB     true
    }

    lappend ::logText "invoiceADays='$invoiceADays', invoiceBDays='$invoiceBDays', invoiceB='$invoiceB'"

    set voucherMonth $month
    set voucherDay $day
    set voucherYear $year
    for {set i 0} {$i < $voucherCount} {incr i} {
	set voucherDaysInMonth [convertMonthYearToDays $voucherMonth $voucherYear]
	
	if {"$day" == 1} {
	    set invoiceADays 30
	    set invoiceBDays  0
	    set invoiceB      false
	} elseif {($day == $daysInMonth)} {
	    set invoiceADays  1
	    set invoiceBDays 29
	    set invoiceB      true
	} else {
	    set invoiceADays [expr {31-$day}]
	    set invoiceBDays [expr {30-$invoiceADays}]
	    set invoiceB     true
	}


    }
}



set customerLine [set TYPE-CUST($customerName)]
lassign $customerLine {*}$nameList(TYPE-CUST)

set company [set $companyField]
set house [set $houseField]
set splitAccount "Program Fees:Program Fees - $house"
set memo "$month $year Program Fees"

set invItem "Program Fee:. $house"

if {0} {

set fees [format %2.2f $fees]
set fInvNumber "$month-[format %0.4d $invoiceNumber]"
lappend invoiceLines [list TRNS "" INVOICE $invoiceDate "Accounts Receivable" [set $nameField] "" $fees $fInvNumber $memo N Y N "" "" "$terms" "" $invoiceDate $invoiceDate]
incr invoiceNumber
set houseAccountName $house
if {[string match "*Timothy*" "$houseAccountName"]} {
    set houseAccountName "1 & 2 Timothy"
}

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


set fees [programFeePerHouse $house $company $monthNumber]

set iifFile ""
foreach dataLine $invoiceLines {
	append iifFile [join $dataLine \t]\n
}

set finalIIFfileName "$customerName-invoices.iif"

set fdout2 [open [file join $dataDirectory $finalIIFfileName] w+]
puts -nonewline $fdout2 $iifFile
close $fdout2

close $fdout

invoiceList "Matthew" "Jan 15, 2017" 3

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
<pre>$customerLine</pre>
<pre>
House = $house
Company = $company
monthNumber = $monthNumber
Fees = $fees</pre>

<pre>
[join $::logText "\n"]
</pre>
</html>"
