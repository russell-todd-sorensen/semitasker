set url [ns_conn url]
set splitUrl [split $url /]
set requestedFile [lindex $splitUrl end]
set urlDirectory [join [lrange $splitUrl 0 end-1] /]
set directory [ns_normalizepath $urlDirectory]/
set pageroot [ns_info pageroot]
set absolutePath [file join $pageroot [string trimleft $directory /]]/
ns_log Notice "absolutePath='$absolutePath' dir='[file dirname $absolutePath]'"
set dataDirectory [file join [file dirname $absolutePath] website-data data]/
ns_log Notice "dataDirector='$dataDirectory'"
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
            ns_log Notice *****"Made type TYPE-$type"
        } else {
            continue
        }
    } elseif {[string match "END?*" "$type"]} {
        continue
    } elseif {[string match "CUSTNAMEDICT" "$type"]} {
    	set currentName "-"
    	foreach name $nameList(TYPE-CUSTNAMEDICT) value $line {
    		if {"$name" eq "INDEX"} {
    			set currentName $value
    			set TYPE-${type}($value) $line
    			set TYPE-${type}Index($value) $arrayIndex(TYPE-$type)
    		}
    		set TYPE-${type}$arrayIndex(TYPE-$type)($name) $value
    	}
    	set  TYPE-${type}Array($arrayIndex(TYPE-$type)) TYPE-${type}$arrayIndex(TYPE-$type)
        incr arrayIndex(TYPE-$type)
    } else {
        # append data
        #ns_log Notice "TYPE='$type' fields='$nameList(TYPE-$type)'"

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

            if {"$name" eq "NAME" || (("$type" eq "SALESREP" ) && ("$name" eq "INITIALS"))} {
                set currentName $value
                set TYPE-${type}($value) $line
                set TYPE-${type}Index($value) $arrayIndex(TYPE-$type)
            }
            #ns_log Notice "SETTING 'TYPE-${type}$arrayIndex(TYPE-$type)($name)' value '$value'"
            set TYPE-${type}$arrayIndex(TYPE-$type)($name) $value
        }

        if {"$continue"} {
            continue
        }
        #ns_log Notice "setting 'TYPE-${type}Array($arrayIndex(TYPE-$type))' to 'TYPE-${type}$arrayIndex(TYPE-$type)'"
        set TYPE-${type}Array($arrayIndex(TYPE-$type)) TYPE-${type}$arrayIndex(TYPE-$type)
        incr arrayIndex(TYPE-$type)
    }
}

ns_log Notice ">>>---->>>> dataArrayList='$dataArrayList'"
ns_log Notice ">>>---->>>> nameList(TYPE-SALESREP)='$nameList(TYPE-SALESREP)'"

foreach arrayName $dataArrayList {
    if {"$arrayName" eq "TYPE-SALESREP"} {
        ns_log Notice ">>>---->>>> TYPE-SALESREP NAMES='[array names TYPE-SALESREP]'"
    }
}