set problem {
    # Enter problem description, exactly started
    Implement an autocomplete system. That is,
    given a query string s and a set of all
    possible query strings, return all strings
    in the set that have s as a prefix.

    For example, given the query string 'de' and
    the set of strings [dog, deer, deal], return
    [deer, deal].
}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
    Pre-process dictionary into trie structure,
    which is a prefix tree, the result will be every
    word in a single subtree with the given
    prefix.
    Function will take the prefix and a dictionary
    name and will process the dictionary into a trie
    then search and return the entries in the matching
    subtree.
}

proc sourceAFile { localName } {
    upvar data([file rootname $localName]) local
    set urlList [lrange [ns_conn urlv] 0 end-1]
    lappend urlList $localName
    set urlToFile /[join $urlList / ]
    source [ns_url2file $urlToFile]
}

if {[namespace exists ::ac]} {
    namespace delete ::ac
}

namespace eval ::ac {
    variable root
    variable N
    variable dictionary
    variable data
    variable nodeId 0
    variable nodes [list]
    variable results [list]
}

set data(test) {
    dog
    deer
    dig
    deal
    big
    bigger
    bigdeal
    small
}

proc ::ac::newNode { } {
    variable nodeId
    variable nodes
    set node N$nodeId
    variable $node
    lappend nodes $node
    incr nodeId
    return $node
}

proc ::ac::print {nodeName {word ""}} {
    #ns_log Notice "nodeName='$nodeName' word='$word'"
    variable nodes
    variable $nodeName
    variable results
    #ns_log Notice "$nodeName exists? = [array exists $nodeName] names = [array names $nodeName]"
    if {[info exists ${nodeName}(-Leaf-)]} {
        set isLeaf 1
        unset ${nodeName}(-Leaf-)
        set origNodeName $nodeName
        lappend results $word
    } else {
        set isLeaf 0
    }
    foreach child [lsort -integer [array names $nodeName]] {
        set newValue $word
        variable [set ${nodeName}($child)]
        append newValue [format %c $child]
        #ns_log Notice "looking for array [set ${nodeName}($child)]"
        if {[array exists [set ${nodeName}($child)]]} {
            #ns_log Notice "array ${nodeName}($child) exists"
            print [set ${nodeName}($child)] $newValue
        } else {
            #ns_log Notice "array [set ${nodeName}($child)] does not exist"
            lappend results $newValue
        }
    }
    if {$isLeaf} {
        set ${origNodeName}(-Leaf-) -Leaf-
    }
}

proc ::ac::findNode {nodeName {word ""}} {

    variable $nodeName

    ns_log Notice "$nodeName exists? = [array exists $nodeName] names = [array names $nodeName]"
    set foundPrefix ""
    foreach char [split $word ""] {
        #ns_log Notice "char='$char'"
        scan $char %c code
        set arr ${nodeName}($code)
        if {[info exists $arr]} {
            append foundPrefix $char
            variable [set $arr]
            if {[array exists [set $arr]]} {
                set nodeName [set $arr]
                continue
            } else {
                set nodeName 0
                break
            }
        } else {
            set nodeName -1
        }
    }

    if {$foundPrefix == $word} {
        #ns_log Notice "SUCCESS foundPrefix=$foundPrefix , word=$word"
        return $nodeName
    } else {
        #ns_log Error "ERROR prefix='$word' not found. Found='$foundPrefix'"
        return -1
    }
}

proc ::ac::createDict {name data} {
    variable root
    variable N
    variable dictionary
    variable nodes
    variable results

    set node [newNode]
    set root $node
    variable $root
    foreach word $data {
        set letters [split $word ""]
        set log [list]
        set node $root
        lappend log "top node=$node"
        foreach letter $letters {
            scan $letter %c unicode
            if {[info exists ${node}($unicode)]} {
                set node [set ${node}($unicode)]
            } else {
                set ${node}($unicode) [newNode]
                set node [set ${node}($unicode)]
                variable $node
            }

            lappend log "node=$node $letter = $unicode "
        }
        #ns_log Notice "$word = \n[join $log \n]"

        set ${node}(-Leaf-) -Leaf-
    }
    #ns_log Notice "root = [parray $root]"
    #foreach n $nodes {
        #if {[array exists $n]} {
            #ns_log Notice "Node $n = [parray $n]"
        #} else {
            #ns_log Notice "Leaf $n "
        #}
    #}
    print $root
    #ns_log Notice "words = $results"
}

proc ::ac::autoComplete {{prefix de} {dict test}} {
    return "prefix=$prefix dict=$dict"
}

set dictId 1
set prefix de

set form   [ns_conn form]
set dictId [ns_set get $form d $dictId]
set prefix [ns_set get $form p $prefix]

array set DICT {1 test 2 larger 3 google-10000}

set dict $DICT($dictId)

if {![info exists data($dict)]} {
    sourceAFile $dict.txt
}

::ac::createDict $dict $data($dict)

set result [::ac::autoComplete $prefix $dict]

set ::ac::results [list]

set NODE [::ac::findNode $::ac::root $prefix]

switch -exact -- $NODE {
    "0" {
        # prefix is only matching word in dict
        set results "$prefix"
    }
    "-1" {
        # prefix not found
        set results ""
    }
    default {
        ::ac::print $NODE $prefix
        set results $::ac::results
    }
}

set numberOfNodes $::ac::nodeId
set numberOfWords [llength $data($dict)]
set numberOfChars [string length [join $data($dict) ""]]
set charsInDict   [lsort -unique [split [join $data($dict) ""] ""]]
set numberOfUniqueChars [llength $charsInDict]

set selectOption "<option value='$dictId' selected>$dict</option>\n"

ns_return 200 text/html "
<html>
<head>
<title>AutoFill '$prefix' from Dictionary '$dict'</title>
</head>
<body>
<form autocomplete='off'>
<ul>
 <li>
  <label for='d'>Dictionary Name</label>
  <select name='d' id='d'>
   $selectOption
   <option value='1'>Test</option>
   <option value='2'>Larger 1000 words</option>
   <option value='3'>Google 10,000</option>
  </select>
 </li>
 <li>
  <label for='p'>Prefix:</label>
  <input name='p' id='p' value='$prefix'>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
prefix = '$prefix'
dict   = '$dict'
Stats:
 Number Of Words = $numberOfWords
 Number Of Nodes = $numberOfNodes
 Number Of Chars = $numberOfChars
 No Unique Chars = $numberOfUniqueChars
 Chars  In Dict  = $charsInDict
 Words In Result = [llength $results]

Results = '
[join $results \n]'
</pre>
</body>
</html>"
