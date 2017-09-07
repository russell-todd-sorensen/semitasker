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


proc writeCustomer { custName invArray custHeaderList custArray} {
    upvar $invArray invoiceHeaderList
    upvar $custHeaderList customerHeaderList
    upvar ${custArray}($custName) customerDataList
    
    set customerFields $customerHeaderList
    set customerDataLine [list]
    foreach field $customerFields value $customerDataList {
        ns_log Notice "$field = $value"
        lappend customerDataLine $value
    }
    set customerLines [list]
    lappend customerLines [join $customerFields \t]
    lappend customerLines [join $customerDataLine \t]
    
    set output [join $customerLines \n]
    
    return $output
}


