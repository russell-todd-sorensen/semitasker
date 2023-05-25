set problem {
    #demonstrate usage of tcl interp for safe computing
}

set solution {
    # Mostly interested in using interp to change the recursion limit
    # for massively recursive procedures.
    # The current built in limit is 1000.
}

if {[llength [info proc deleteInterp]] == 0} {
    proc deleteInterp {alias} {
        if {[interp exists $alias]} {
            interp delete $alias
        }
    }
}

deleteInterp recurse

set myInterp [interp create recurse]
ns_atclose deleteInterp $myInterp

interp eval $myInterp {

    namespace eval ::log {
        variable journal
        variable domains [list]

        if {[array exists journal]} {
            array unset journal
        }

        proc new {name {lineFmt "%5.5d"} } {
            variable journal
            variable domains
            if {[info exists journal(name)]} {
                return $name
            } else {
                lappend domains $name
                set journal(${name}:fmt) $lineFmt
                set journal(${name}:count) 0
                rec $name "added new log named '$name'"
            }
        }
        proc rec {name what} {
            variable journal
            set fmt $journal(${name}:fmt)
            set journal(${name}:[format $fmt [incr $journal(${name}:count)]]) $what
        }

        proc init {} {
            variable journal
        }

        proc print {name {keyGlob *} {joinBy \n} {reset 0}} {
            variable journal
            set lines [lsort -stride 2 [array get journal ${name}:$keyGlob]]
            set result [join $lines $joinBy]
            if {$reset} {
                set fmt $journal(${name}:fmt)
                array unset journal ${name}:$keyGlob
                set journal(${name}:fmt) $fmt
                set journal(${name}:count) 0
            }
            return $result
        }
        namespace export *
    }
    namespace eval :: {
        namespace import -force ::log::*
        init
        new log
        proc exampleProc {a b} {
            rec log "got a=$a, b=$b"
        }
    }

}


set n 2
set m 35
set defaultMax 1000

set form [ns_conn form]
set n [ns_set get $form n $n]
set m [ns_set get $form m $m]

if {$m > $defaultMax} {
    set m $defaultMax
}

# raise upper limit on recursive calls
try {
    interp recursionlimit $myInterp $m
    set result [$myInterp eval exampleProc $n "start"]
    set logs [$myInterp eval print log]
    set recursions [interp recursionlimit $myInterp]
ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Generic Interp Template for Algorithm Testing</title>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='n'>Variable N:</label>
  <input name='n' id='n'  value='$n'>
 </li>
 <li>
  <label for='m'>Max Interp recursion:</label>
  <input name='m' id='m' value='$m'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>

<pre>
n = '$n'
maxRecursions = '$m'
result = '$result'
recursion limit = [interp recursionlimit $myInterp]

logs =
$logs
</pre>
</body>
</html>"
} on error {errorTrace optionList} {
    global errorInfo
    set errorText [ns_adp_parse -file [ns_url2file /services/return-code/500/internal-server-error.adp]]
    ns_return 500 text/html $errorText
}
