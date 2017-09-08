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
set fdout [open [file join $dataDirectory "voucher-iifCSVFile.csv"] w+]
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
                #ns_log Notice "************ $type $value"
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
set ctypeField  "CTYPE" ;#X
set termsField  "TERMS" ;#X
set emailField  "EMAIL"
set addrNameField "BADDR1"
set refnumField "REFNUM"
set nameField   "NAME"
set jobtypeField "JOBTYPE" ;#X
set typeField   "!CUST"
set pricelevelField "PRICELEVEL" ;#X

set nameList2(TYPE-CUST) [string map [list CTYPE $ctypeField TERMS $termsField JOBTYPE $jobtypeField PRICELEVEL $pricelevelField] $nameList(TYPE-CUST)]


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