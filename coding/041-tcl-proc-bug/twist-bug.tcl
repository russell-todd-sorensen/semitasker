
proc ::<ws>proc {
    procName
    procArgsList
    procBody
    {returns ""}
    {returnList ""}
} {

    # Determine or Create Schema/Namespace
    set tclNamespace [namespace qualifiers $procName]
    set xmlPrefix [namespace tail $tclNamespace]

    if {[<ws>namespace isFrozen $tclNamespace]} {
        return 1
    }

    <ws>namespace schema $tclNamespace

    set args [list]
    set inputTypeList [list]
    set inputConversionList [list]
    set outputConversionList [list]


    <ws>log Notice "<ws>proc procArgsList = '$procArgsList'"

    if {[llength $procArgsList] == 1
        && [llength [lindex $procArgsList 0]] == 1
    } {
        # See if this is just the name of a complexType
        set argTypeNameList [split [lindex $procArgsList {0 0}] ":"]
        if {[llength $argTypeNameList] == 1} {
            set argType [lindex $argTypeNameList 0]

            if {[namespace exists ::wsdb::elements::${xmlPrefix}::${argType}]
                && [info exists ${tclNamespace}::elements($argType)]
            } {
                set procArgsList [lindex [set ${tclNamespace}::elements($argType)] 0]
                set inputElementName $argType
            }
        }
    }
    set argIndex 0
    foreach argList $procArgsList {
        #<ws>log Notice "<ws>proc argList = '$argList'"

        # This Array will remain available procArgsList length = 1;
        if {[array exists elementData]} {
            array unset elementData
        }

        set argName [::wsdl::elements::modelGroup::sequence::getElementData\
            $argList elementData];

        lappend inputConversionList $argName


        if {[info exists elementData(default)]} {
            lappend args [list $argName $elementData(default)]
        } else {
            lappend args [list $argName]
        }
        #<ws>log Notice "=> argIndex=$argIndex argName='$argName'"
        #<ws>log Notice "=> lappended '$argName' to args"
        incr argIndex
    }
    <ws>log Notice "=> number of args added=$argIndex"

    # Handle return type
    set returnTypeList [list]

    if {"$returns" eq "" || "$returnList" eq ""} {
        lappend returnList [list ResultString]
        lappend outputConversionList [list ResultString]
    } else {
        # See if returnList is just a return Type:
        if {[llength $returnList] == 1
            && [llength [lindex $returnList 0]] == 1
        } {
            # See if this is just the name of a complexType
            set returnArgTypeNameList [split [lindex $returnList {0 0}] ":"]
            if {[llength $returnArgTypeNameList] == 1} {
                set returnArgType [lindex $returnArgTypeNameList 0]

                if {[namespace exists ::wsdb::elements::${xmlPrefix}::${returnArgType}]
                    && [info exists ${tclNamespace}::elements($returnArgType)]
                } {
                    set returnList [lindex [set ${tclNamespace}::elements($returnArgType)] 0]
                    set outputElementName $returnArgType
                }
            }
        }

        foreach returnArg $returnList {
            # This Array will remain available returnList length = 1;
            if {[array exists returnData]} {
                array unset returnData
            }

            lappend outputConversionList \
                [::wsdl::elements::modelGroup::sequence::getElementData\
                $returnArg returnData];
        }
    }

    # Create the wrapper procedure:
    # but first log
    #<ws>log Notice "ws-proc: procName='$procName' args='$args' procBody='$procBody'"
    if {[catch {
        proc $procName $args $procBody
    } err]} {
        global errorInfo
        <ws>log Notice "proc $procName failed with error '$errorInfo', trying again...."
        <ws>log Notice "argCount = [llength $args] args=$args"
        proc $procName $args $procBody
    }

    # baseName will be used as a template to name wsdl types:
    set baseName [namespace tail $procName]

    # XML Schema Element Types (complexType):
    # Create input/output element as type to be used for message:
    if {![info exists inputElementName]} {
        set inputElementName ${baseName}Request
    }

    <ws>element sequence ${xmlPrefix}:$inputElementName\
        $procArgsList $inputConversionList;

    if {![info exists outputElementName]} {
        set outputElementName ${baseName}Response
    }

    <ws>element sequence ${xmlPrefix}:$outputElementName\
        $returnList $outputConversionList;

    # WSDL Messages
    set inputMessageName ${baseName}RequestMsg
    eval [::wsdl::messages::new $xmlPrefix $inputMessageName $inputElementName]

    set outputMessageName ${baseName}ResponseMsg
    eval [::wsdl::messages::new $xmlPrefix $outputMessageName $outputElementName]

    # WSDL Operation
    set operationName ${baseName}Operation
    eval [::wsdl::operations::new $xmlPrefix $operationName \
          [list $procName $procArgsList] \
          [list input $inputMessageName] [list output $outputMessageName]];

    <ws>namespace lappend $tclNamespace operations $operationName
}
