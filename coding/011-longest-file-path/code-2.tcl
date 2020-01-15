set problem {
    # Enter problem description, exactly started
Suppose we represent our file system by a string
in the following manner:

The string "dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext"
represents:

dir
    subdir1
    subdir2
        file.ext

The directory dir contains an empty sub-directory
subdir1 and a sub-directory subdir2 containing a
file file.ext.

The string "dir\n\tsubdir1\n\t\tfile1.ext
    \n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2
    \n\t\t\tfile2.ext"
dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext
represents:

dir
    subdir1
        file1.ext
        subsubdir1
    subdir2
        subsubdir2
            file2.ext

The directory dir contains two sub-directories
subdir1 and subdir2. subdir1 contains a file
file1.ext and an empty second-level sub-directory
subsubdir1. subdir2 contains a second-level
sub-directory subsubdir2 containing a file
file2.ext.

We are interested in finding the longest
(number of characters) absolute path to a file
within our file system. For example, in the second
example above, the longest absolute path
is "dir/subdir2/subsubdir2/file2.ext", and its length
is 32 (not including the double quotes).

Given a string representing the file system in the
above format, return the length of the longest
absolute path to a file in the abstracted file system.
If there is no file in the system, return 0.

Note:

The name of a file contains at least a period and
an extension.

The name of a directory or sub-directory will not
contain a period.

}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
    It seems like a simple stack concept will work here.
    Count characters until you reach \n, push this number,
    and maybe the string as a list into position 1
    max = 0
    s[0] = (0,'')
    d i r \n --> s[1] = (3,'dir')
    the \t pulls 3 off (advances the index to 2)
    s u b d i r 1 \n --> s[2] = (7,'subdir1')
    \t leaves s[1] as is \t leaves s[2] as is
    f i l e 1 . [Notice we have file] e x t \n --> s[3] = (8,'file1.ext') store max =Max(max,3+7+8+2) = 20 (two / to join the 3 components)
    \t leaves s[1] \t leaves s[2]
    s u b s u b d i r 1 \n -> s[3] = (10,'subsubdir1')
    \t leaves s[1]
    s u b d i r 2 \n --> s[2] = (7,'subdir2')
    \t leaves s[1] \t leaves s[2]
    s u b s u b d i r 2 \n -> s[3] = (10,'subsubdir2')
    \t leaves s[1] \t leaves s[2] \t leaves s[3]
    f i l e 2 . [Notice we have a file] e x t \n --> s[4] = (9,'file2.ext') store max = Max(20,3+7+10+9+3) = 32

    return max
}

proc Max {max level {stackName stack}} {
    set sum 0
    set string [list]
    upvar $stackName s

    for {set i 1} {$i <= $level} {incr i} {
        lassign $s($i) len str
        incr sum $len
        lappend string $str
        incr sum ;# will reduce by 1 at end
    }

    incr sum -1

    if {$sum < [lindex $max 0]} {
        return $max
    } elseif {$sum > $max } {
        return [list $sum [join $string /]]
    } else {
        set maxStringList [lindex $max 1]
        lappend maxStringList [join $string /]
        return [list $sum $maxStringList]
    }
}

proc findLongestPath {fs} {
    set max [list 0 {{}}]
    set level 0
    set stack($level) [list 0 ""]
    set slen 0
    set sval ""
    set isFile false
    append fs \n

    foreach char [split $fs ""] {

        switch -exact -- $char {
            "\n" {
                incr level
                set stack($level) [list $slen $sval]
                set sval ""
                set slen 0
                if {$isFile} {
                    set max [Max $max $level stack]
                    set isFile false
                }
                set level 0
            }
            "\t" {
                incr level
            }
            default {
                if {$char eq "."} {
                    set isFile true
                }
                incr slen
                append sval $char
            }
        }
    }

    return $max
}

set fs "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext"

set form [ns_conn form]
set fs   [ns_set get $form fs $fs]

set result [findLongestPath [string map {"\r\n" "\n"} $fs]]

if {[llength [lindex $result 1]] > 1} {
    lassign $result maxLength longestPathsList
    set numMaxPaths [llength $longestPathsList]
    set result "
        max path length found             = $maxLength
        paths of length $maxLength found          = $numMaxPaths
        actual Paths                      =
        [join $longestPathsList \n\t]
"
}


ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Find Longest File Path in Filesystem: Version 2</title>
<style>
li {
    list-style: none;
}
</style>
<script src='add-tab.js'></script>
</head>
<body>
<form autocomplete='off' method='POST' encoding='multi-part/formdata'>
<ul>
 <li>
  <label for='fs'>Input List</label>
 </li>
 <li>
  <textarea name='fs' id='fs' rows='10' cols='70' spellcheck='false' >$fs</textarea>
 </li>
   <input type='button' onclick='addTab(\"fs\")' value='Add Tab' />
   <input type='submit' value='Submit Filesystem For Analysis'/>
 </li>
 </ul>
</form>
<a href='source.tcl?code-2.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>
<pre>
fs = '$fs'
result = '$result'
</pre>
</body>
</html>"
