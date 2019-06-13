set problem {
    # Enter problem description, exactly started
Write an algorithm to justify text. Given a sequence
of words and an integer line length k, return a list
of strings which represents each line, fully justified.

More specifically, you should have as many words as
possible in each line. There should be at least one
space between each word. Pad extra spaces when necessary
so that each line has exactly length k. Spaces should be
distributed as equally as possible, with the extra
spaces, if any, distributed starting from the left.

If you can only fit one word on a line, then you should
pad the right-hand side with spaces.

Each word is guaranteed not to be longer than k.

For example, given the list of words
["the", "quick", "brown",
 "fox", "jumps", "over",
 "the", "lazy", "dog"]
and k = 16, you should return the following:

["the  quick brown", # 1 extra space on the left
"fox  jumps  over", # 2 extra spaces distributed evenly
"the   lazy   dog"] # 4 extra spaces distributed evenly

}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
}

proc justifyWordsToLines {k wordList} {
    set lines [list]
    set line [list]
    set charCount 0
    set wordLength 0
    set wordsInLine 0

    foreach word $wordList {
        set wordLength [string length $word]
        set total [expr {$charCount + $wordsInLine + $wordLength}]
        if {$total == $k} { ;# easy case
            lappend lines [concat $line $word]
            set line [list]
            set charCount 0
            set wordsInLine 0
            continue
        } elseif {($wordsInLine == 1) && ($charCount == $k)} { ;# special case
            lappend lines [lindex $line 0]
            set line [list $word]
            set charCount $wordsLength
            continue
        } elseif {$total < $k} { ;# second easy case
            lappend line $word
            incr wordsInLine
            incr charCount $wordLength
            continue
        } else { ;# too much, time to justify
            distributeSpaces {k word words line lines charCount wordsInLine wordLength}
        }
    }
    if {[llength $line] > 0} {
        distributeSpaces {k word words line lines charCount wordsInLine wordLength}
    }
    return $lines
}

proc distributeSpaces { stateVars } {
    foreach var $stateVars {
        upvar 1 $var $var
    }

    set totalWhitespace [expr {$k - $charCount}]
    # before we divide by zero, check if we have only one word

    if {$wordsInLine == 1} {
        lappend line [string repeat " " $totalWhitespace]
        lappend lines [join $line ""]
        set line [list $word]
        set charCount $wordLength
    } else {
        set spacesToFill [expr {$wordsInLine - 1}]
        set equalSpacing [expr {$totalWhitespace / $spacesToFill}] ;# integer math
        set remainder [expr {$totalWhitespace % $spacesToFill}]
        set tmpLine ""
        set i 0
        set remainingWhitespace $totalWhitespace
        while {$remainder > 0 && $spacesToFill > 1} {
            set tmpLine [join [list [string repeat " " $equalSpacing] [lindex $line end] $tmpLine] ""]
            set line [lrange $line 0 end-1]
            incr spacesToFill -1
            incr remainingWhitespace -$equalSpacing
            set equalSpacing [expr {$remainingWhitespace/$spacesToFill}]
            set remainder [expr {$remainingWhitespace % $spacesToFill}]
            incr i
        }

        lappend lines [join [list [join $line [string repeat " " $equalSpacing]] $tmpLine] ""]
        set line [list $word]
        set charCount $wordLength
        set wordsInLine 1
    }
}

set words [list the quick brown fox jumps over the lazy dog]
set k 16

set form [ns_conn form]
set words [ns_set get $form w $words]
set k [ns_set get $form k $k]

set wordsLength [string length $words]

set result [justifyWordsToLines $k $words]
set tens "|         1         2         3         4         5         6         7         8"
set meter |12345678901234567890123456789012345678901234567890123456789012345678901234567890
set clippedTens [string range $tens 0 $k]|
set clippedMeter [string range $meter 0 $k]|

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Justify List of Words Into Lines</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='w'>Input Word List</label>
  <input name='w' id='w'  value='$words' size='$wordsLength'>
 </li>
 <li>
  <label for='k'>Line Length (k)</label>
  <input name='k' id='k' value='$k'>
 <li>
  <input type='submit' value='Justify Text'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
words = '$words'
k = '$k'
result =
$clippedTens
$clippedMeter
|[join $result |\n|]|
</pre>
<a href='code-3.tcl?w=An+experimental+drug+has+protected+monkeys+against+infection+with+Nipah+virus%2C+a+lethal+disease+and+emerging+pandemic+threat+for+which+there+is+no+approved+vaccine+or+cure+scientists+reported+on+Wednesday.++The+antiviral+drug%2C+remdesivir%2C+is+also+being+tested+against+the+Ebola+virus+in+the+outbreak+now+underway+in+the+Democratic+Republic+of+Congo.++The+only+current+treatment+for+Nipah+virus+infection+is+a+monoclonal+antibody+that+is+still+experimental+it+was+tested+during+an+outbreak+in+India+last+year.&k=70'>Test String</a>
</body>
</html>"
