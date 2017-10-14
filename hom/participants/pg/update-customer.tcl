# Tcl script to create participant directories and info files

set url [ns_conn url]
set splitUrl [split $url /]
set requestedFile [lindex $splitUrl end]
set urlDirectory [join [lrange $splitUrl 0 end-1] /]
set directory [ns_normalizepath $urlDirectory]/
set pageroot [ns_info pageroot]
set absolutePath [file join $pageroot [string trimleft $directory /]]/
ns_log Notice "absolutePath='$absolutePath' dir='[file dirname $absolutePath]'"
set dataDirectory [file join [file dirname $absolutePath] data]/
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

set csvFileName "doc-invoice-temp.csv"

set fdout [open [file join $dataDirectory $csvFileName] w+]
puts -nonewline $fdout $data
chan seek $fdout 0


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

            if {"$name" eq "NAME"} {
                set currentName $value
                set ${type}($value) $line
                set ${type}Index($value) $arrayIndex($type)
            }
            set ${type}$arrayIndex($type)($name) $value
        }

        set ${type}Array($arrayIndex($type)) ${type}$arrayIndex($type)
        incr arrayIndex($type)
    }
}


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

set output [list "START OF OUTPUT"]

set nameList2(CUST) [string map [list CTYPE $ctypeField TERMS $termsField JOBTYPE $jobtypeField PRICELEVEL $pricelevelField] $nameList(CUST)]

foreach participant [lsort [array names CUST]] {
    lassign $CUST($participant) {*}$nameList2(CUST)

    set skipFurtherProcessing 0
    set continue 0
    if {[set $houseField] eq "Office"} {
        continue
    }
    
    
    
    set ctype [string map {" " -} [set $ctypeField]]
    set company [set $companyField]
    set house [string map {" " -} [set $houseField]]
    set firstName [set $firstNameField]
    set lastName [set $lastNameField]
    set active $HIDDEN
    
    if {!$active} {
 
        set participantDirectory [string tolower $lastName-$firstName]
        if {[string length $participantDirectory] == 1} {
            #lappend output !!!$CUST($participant)
            continue
        }
        set tmpName ""
        set errors 0
        foreach letter [split $participantDirectory ""] {
            if {[lsearch -exact [list a b c d e f g h i j k l m n o p q r s t u v w x y z -] $letter] == -1} {
                if {[lsearch -exact  [list \n \t " " _] $letter] > -1} {
                    append tmpName -
                    continue
                }
                if {[lsearch -exact [list .] $letter] > -1} {
                    continue
                }
                incr errors
                append tmpName [string toupper $letter]
            } else {
                
                append tmpName $letter
            }
        }
        if {$errors > 0} {
            lappend output "errors = $errors for $firstName $lastName"
            continue
        }

    }
    
}

ns_return 200 text/plain [join $output \n]