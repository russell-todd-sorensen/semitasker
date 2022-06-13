set problem {
    #Testing UTF-8 handling in Naviserver
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
        proc exampleProc {f b} {
            rec log "got f='$f', b=$b"
        }
    }
}

#
# ns_getform --
#
#    Return the connection form, copying multipart form data
#    into temp files if necessary.
#

proc ns_getform_safe {{charset ""}}  {
    global _ns_form _ns_formfiles

    #
    # If a charset has been specified, use ns_urlcharset to
    # alter the current conn's urlcharset.
    # This can cause cached formsets to get flushed.
    if {$charset != ""} {
        ns_urlcharset $charset
    }

    ns_log Notice "ns_getform_safe charset='$charset' _ns_form exists=[info exists _ns_form]"

    if {![info exists _ns_form]} {

        set _ns_form [ns_conn form]
        ns_log Notice "ns_getform_safe _ns_form='$_ns_form'"

        foreach {file} [ns_conn files] {

            set off     [ns_conn fileoffset $file]
            set len     [ns_conn filelength $file]
            set hdr     [ns_conn fileheaders $file]
            set type    [ns_set get $hdr content-type]
            set fp      ""
            set max     3
            set count   0
            ns_log Notice "file='$file'"

            while {($count < $max) && ($fp == "")} {
                incr count
                set fp [file tempfile tmpfile "/web/servers/ns-4.99.23rc1/tmp/ns"]
                #set fp [ns_openexcl $tmpfile]
            }

            fconfigure $fp -translation binary
            ns_conn copy $off $len $fp

            close $fp

            ns_atclose "file delete $tmpfile"

            set _ns_formfiles($file) $tmpfile

            #ns_set put $_ns_form $file.content-type $type
            #NB: Insecure, access via ns_getformfile.
            #ns_set put $_ns_form $file.tmpfile $tmpfile
        }
    }
    return $_ns_form
}


# qw upload testing

proc ::upload_files {files array} {
    upvar $array Array

    set object_key [nsv_get qw_obj_key upload]

    if {[info exists Array($object_key)] && ![empty_string_p $Array($object_key)]} {
        set object_id $Array($object_key)
    } else {
        set object_id [db_string acs_object_id "select acs_object_id_seq.nextval"]
        set Array($object_key) $object_id
    }

    foreach {attribute original_file_var} $files {

        log Notice "Got file for '$attribute' original_file_var: '$original_file_var'"

        set tmpfile [ns_getformfile $original_file_var]
        set filesize [ns_conn filelength $original_file_var]
        set headers [ns_conn fileheaders $original_file_var]
        set content_type [ns_set iget $headers "content-type"]
        set content_disposition [ns_set iget $headers "content-disposition"]
        set filename $Array($attribute)
        set backslash "\\"

        log Notice "backslash: '$backslash'"

        if {[set last_backslash [string last $backslash $filename]] > -1 } {
            set filename [string range $filename [expr $last_backslash + 1] end]
            set Array($attribute) $filename
        }

        log Notice "tmpfile is '$tmpfile' filesize: $filesize content-type: $content_type
content-disposition: '$content_disposition'
filename: '$filename'"
        log Notice "Key: $object_key value: $Array($object_key)"

        # Okay where to upload the file to based on input
        set path /tmp/$object_id/$attribute/
        file mkdir $path
        file copy $tmpfile $path$filename
    }

}

# raise upper limit on recursive calls
try {

set d 2
set defaultMax 1000
set max 35
set filename "none"

#set form [ns_conn form]
set form [ns_getform_safe]
set d [ns_set get $form d $d]
set m [ns_set get $form m $defaultMax]
set f [ns_set get $form f $filename]

if {$m > $max} {
    set m $max
}


    set request     [ns_conn request]
    set url         [lindex $request 1]
    set method      [lindex $request 0]
    set httpVersion [lindex $request 2]
    set transport   [string toupper [ns_conn protocol]]
    set tail        [file tail [lindex $request 1]]
    set hostHeader  [ns_set iget [ns_conn headers] host]
    set referer     [ns_set iget [ns_conn headers] referer "None Sent"]




    interp recursionlimit $myInterp $m
    set result [$myInterp eval exampleProc "$f" "start"]
    set logs [$myInterp eval print log]
    set recursions [interp recursionlimit $myInterp]
ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Test HTTP POST of UTF-8 Documents with Errors</title>
</head>
<body>
<!--  -->
<form autocomplete='off' spellcheck='false' method='POST' enctype='multipart/form-data'>
<ul>
 <li>
  <label for='d'>Assumed Doctype:</label>
  <input name='d' id='d'  value='$d'>
 </li>
 <li>
  <label for='m'>Max Interp recursion:</label>
  <input name='m' id='m' value='$m'>
 </li>
 <li>
  <label for='f'>UTF-8 Encoded File:</label>
  <input type='file' accept='*/*' name='f' id='f' value='$f'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<a href='source.tcl'>Source Code</a><br>
<a href='explained.txt'>Solution Explained</a>

<pre>
d = '$d'
maxRecursions = '$m'
f = '$f'
result = '$result'
recursion limit = [interp recursionlimit $myInterp]

logs =
$logs
</pre>
<h4>File Upload Info</h4>
<pre>
Files found: [array get _ns_formfiles]
</body>
</html>"
} on error {errorTrace optionList} {
    global errorInfo
    set errorText [ns_adp_parse -file [ns_url2file /services/return-code/500/internal-server-error.adp]]
    ns_return 500 text/html $errorText
}