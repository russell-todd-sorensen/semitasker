set problem {
    # Enter problem description, exactly started
Given a string, find the palindrome that can be
made by inserting the fewest number of characters
as possible anywhere in the word. If there is more
than one palindrome of minimum length that can be
made, return the lexicographically earliest one
(the first one alphabetically).

For example, given the string "race", you should
return "ecarace", since we can add three letters to
it (which is the smallest amount to make a palindrome).
There are seven other palindromes that can be made from
"race" by adding three letters, but "ecarace" comes
first alphabetically.

As another example, given the string "google", you
should return "elgoogle".

}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
Profile the letters in the given string. Even length
palindromes have equal numbers of each character. Odd
length ones have at least most one odd number of a
character.

}

if {[namespace exists ::pal]} {
    namespace delete ::pal
}

namespace eval ::pal {
    variable Count
    variable total 0
    variable letterList [list]
    variable letterType
    variable Odd
    variable Even
    variable oddLetters 0
    variable evenLetters 0
    variable oddLetterList [list]
    variable evenLetterList [list]
    variable allEvenLetters [list]
    variable allOddLetters [list]
}

proc ::pal::profile {prePalindrome} {

    variable Count
    variable total
    variable letterList
    variable letterType
    variable Odd
    variable Even
    variable oddLetters
    variable evenLetters
    variable oddLetterList
    variable evenLetterList
    variable allEvenLetters
    variable allOddLetters

    foreach letter [split $prePalindrome ""] {
        if {![info exists Count($letter)]} {
            set Count($letter) 1
        } else {
            incr Count($letter)
        }
        incr total
    }

    set letterList [lsort -increasing [array names Count]]
    set letterType [llength $letterList]

    foreach letter $letterList {
        if {($Count($letter) % 2) == 0} {
            set Odd($letter) false
            set Even($letter) true
            incr evenLetters
            lappend evenLetterList $letter
            set num [expr $Count($letter)/2]
            ns_log Notice "letter=$letter num=$num"
            lappend allEvenLetters {*}[lrepeat $num $letter]
        } else {
            set Odd($letter) true
            set Even($letter) false
            incr oddLetters
            lappend oddLetterList $letter
            lappend allOddLetters {*}[lrepeat $Count($letter) $letter]
        }
    }
}

proc ::pal::create { } {

    variable Count
    variable total
    variable letterList
    variable letterType
    variable Odd
    variable Even
    variable oddLetters
    variable evenLetters
    variable oddLetterList
    variable evenLetterList
    variable allEvenLetters
    variable allOddLetters

    set minLettersToAdd [expr {$oddLetters - 1}]

    set palindrome ""

    switch -exact -- $minLettersToAdd {
        "-1" {
            foreach letter [concat $letterList [lreverse $letterList]] {
                append palindrome [string repeat $letter [expr $Count($letter)/2]]
            }
        }
        "0" {
            # find odd letter
            set OddLetter [lindex $oddLetterList 0]
            if {$Count($OddLetter) > 1} {
                # we could split letter up like this
                # 1100001000011 (for 5 of a letter)
                # We would only do this if there is no
                # Other even letter lexicographically earlier
                if {[string compare $OddLetter [lindex $evenLetterList 0]] == -1} {
                    # odd wins out
                    set halfOddCount [expr $Count($OddLetter)/2]
                    return [concat [lrepeat $halfOddCount $OddLetter] $allEvenLetters $OddLetter [lreverse $allEvenLetters] [lrepeat $halfOddCount $OddLetter]]
                }
            }
            return [concat $allEvenLetters [lrepeat $Count([lindex $allOddLetters 0]) [lindex $allOddLetters 0]] [lreverse $allEvenLetters] ]
        }
        default {
            if {[info exists oddLetter]} {
                unset oddLetter
            }
            # We have $minLettersToAdd, actually exactly that many
            if {[llength $evenLetterList] > 0} {
                set evenLexEarliest [lindex $evenLetterList 0]
                set haveEarliestLetter 0
                ns_log Notice "evenLexEarliest = $evenLexEarliest, haveEarliestLetter = $haveEarliestLetter"
                for {set i 0} {$i < $minLettersToAdd} {incr i} {
                    set letter [lindex $oddLetterList $i]
                    ns_log Notice "letter=$letter"
                    if {!$haveEarliestLetter && ([string compare $letter $evenLexEarliest] == -1)} {
                        if {$Count($letter) > 1} {
                            set allEvenLetters [concat [lrepeat [expr $Count($letter)/2] $letter] $allEvenLetters]
                        } else {
                            set allEvenLetters [concat $letter $allEvenLetters]
                        }
                        set oddLetter $letter
                        set haveEarliestLetter 1
                    } else {
                        set allEvenLetters [concat [lrepeat [expr ($Count($letter)+1)/2] $letter] $allEvenLetters]
                    }
                }
                set allEvenLetters [lsort -increasing $allEvenLetters]
                if {[info exists oddLetter]} {
                    set palindrome [concat $allEvenLetters $oddLetter [lreverse $allEvenLetters]]
                } else {
                    set palindrome [concat $allEvenLetters [lreverse $allEvenLetters]]
                }

            } else {
                set palindrome noop
            }
        }
    }

    return $palindrome
}

proc ::pal::print { } {

    variable Count
    variable total
    variable letterList
    variable letterType
    variable Odd
    variable Even
    variable oddLetters
    variable evenLetters
    variable oddLetterList
    variable evenLetterList
    variable allEvenLetters
    variable allOddLetters

    foreach var [lsort [info vars [namespace current]::*]] {
        if {[array exists $var]} {
            append output "Array $var\n"
            foreach name [lsort [array names $var]] {
                append output "   ${var}($name) = [set ${var}($name)]\n"
            }
        } else {
            append output "Scalar var $var = [set $var]\n"
        }
    }
    return $output
}

set string race

set form [ns_conn form]
set string [ns_set get $form s $string]

::pal::profile $string
set result [::pal::create]

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Fill In Something Useful</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='s'>Pre-Palindrome</label>
  <input name='s' id='s'  value='$string'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
string = '$string'
palindrome = '$result'
[::pal::print]
</pre>
</body>
</html>"
