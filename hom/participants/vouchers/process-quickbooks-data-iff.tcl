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


set fd [open $iifFile r ]
set data [chan read $fd]
close $fd
set data [string map {\t ,} $data]
set fdout [open [file join $dataDirectory "quickbooks-iifCSVFile.csv"] w+]
puts -nonewline $fdout $data
chan seek $fdout 0
set dataFound 0

set dataArrayList [list]

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
set ctypeField  "CTYPEX"
set termsField  "TERMSX"
set emailField  "EMAIL"
set addrNameField "BADDR1"
set refnumField "REFNUM"
set nameField   "NAME"
set jobtypeField "JOBTYPEX"
set typeField   "!CUST"
set pricelevelField "PRICELEVELX"

set nameList2(CUST) [string map [list CTYPE $ctypeField TERMS $termsField JOBTYPE $jobtypeField PRICELEVEL $pricelevelField] $nameList(CUST)]

proc programFeePerHouse {house company} {
    switch -exact -nocase -- $house {
        Jeremiah - James - Galatians - Philippians {
                set fees 400.00
        }
        Ezra {
            set fees 375.00
        }
        default {
            set fees 500.00
        }
    }
    if {[string match "*DOC Voucher*" $company]} {
        set fees 500.00
    }
    return $fees
}

foreach participant [lsort [array names CUST]] {
    lassign $CUST($participant) {*}$nameList2(CUST) 
    if {[set $houseField] ne "Office"} {
        set ctype [set $ctypeField]
        set company [set $companyField]
        if {[string match "*NO PROGRAM FEES*" "$company"]} {
            set fees "0.00"
        } elseif {[string match "*PROGRAM FEES*" "$company"]} {
            if {[regexp {(.), ([0-9]+)( PROGRAM FEES)} $company all pre fees remain]} {
                ns_log Notice "!!!!!! company='$company' all='$all' pre='$pre' fees='$fees' remain='$remain'"
                set fees ${fees}.00
            } else {
                set fees [programFeePerHouse [set $houseField] [set $companyField]]
            }
        } elseif {"$ctype" eq "Program Participant"} {
            set fees [programFeePerHouse [set $houseField] [set $companyField]]
        } else {
            set fees [programFeePerHouse [set $houseField] [set $companyField]]
        }
     
        append data "[set $nameField] company='[set $companyField]' --FEE: $fees - \n"
    }  
}

foreach arrName $dataArrayList {
   append data "$arrName = \n[join [array get $arrName] "<br>\n"]\n-------------\n"
}

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

</pre>
$table

<pre>iiiiiiiiiiiiiiiiiiiiiiiiiiiiii
$dataArrayList
</pre>
<pre>ttttttttttttttttttttttttt
$data

</body>
</html>"