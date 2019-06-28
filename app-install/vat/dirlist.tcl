proc vat_dirlist {filename} {
    set url [ns_conn url]
    set dir $filename

    #
    # Handle special case of AOLpress MiniWebs.
    #

    if {[nsv_get _ns_fastpath toppage] && [_ns_ismw $dir]} {
        set nvd [_ns_getnvd $dir]
        if [_ns_isaolpress] {
            return [ns_returnfile 200 application/x-navidoc $file]
        }
        set fp [open $nvd]
        while {[gets $fp line] >= 0} {
            if [string match Pages:* $line] {
                break
            }
        }
        gets $fp line
        close $fp
        set file [lindex [split $line \"] 1]
        if [file exists $dir/$file] {
            return [ns_returnredirect $file]
        }
    }

    #
    # Handle default case of directory listing.  Simple
    # format is just the files while fancy includes
    # the size and modify time (which is more expensive).
    #

    switch [nsv_get _ns_fastpath type] {
        simple {
            set simple 1
        }
        fancy {
            set simple 0
        }
        none -
        default {
            return [ns_returnnotfound]
        }
    }

    set hidedot [nsv_get _ns_fastpath hidedot]
    set location [ns_conn location]

    set prefix "${location}${url}/"
    set up "<a href=..>..</a>"
    if $simple {
        append list "
<pre>
$up
"
    } else {
        append list "
<table>
<tr align=left><th>File</th><th>Size</th><th>Date</th></tr>
<tr align=left><td colspan=3>$up</td></tr>
"
    }

    foreach f [lsort [glob -nocomplain $dir/*]] {
        set tail [file tail $f]
        if {$hidedot && [string match .* $tail]} {
            continue
        }

        set link "<a href=\"${prefix}${tail}\">${tail}</a>"

        if $simple {
            append list $link\n
        } else {

            if [catch {
                file stat $f stat
            } errMsg ] {
                append list "
<tr align=left><td>$link</td><td>N/A</td><td>N/A</td></tr>\n
"
            } else {
                set size [expr $stat(size) / 1000 + 1]K
                set mtime $stat(mtime)
                set time [clock format $mtime -format "%d-%h-%Y %H:%M"]
                append list "
<tr align=left><td>$link</td><td>$size</td><td>$time</td></tr>\n
"
            }
        }
    }
    if $simple {
        append list "</pre>"
    } else {
        append list "</table>"
    }
    ns_returnnotice 200 $url $list
}
