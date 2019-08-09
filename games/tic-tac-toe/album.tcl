ad_page_contract {

    @title Albums
    @author tom jackson (tom@junom.com)
    @creation-date Februrary 10, 2004
    @cvs-id $Id$

} {

    {start:integer "0"}
    {end:integer "5"}
    {show:integer "3"}
    {series:trim "thumbs"}
    {cols:integer "3"}
}

set vhost_root /web/zmbh/vhost/budigan

# new resource package
source $vhost_root/resource.tcl
resource::init

set header $vhost_root/www/header
set footer $vhost_root/www/footer
resource::add include $header
resource::add include $footer

set photo_url /images
set base $vhost_root/www/images


set urlv [ad_conn urlv]

# show may have changed by virture of different start/end choices:
if {$show == 3} {
    set show [expr $end - $start + 1]
}

set day 21
set month 03
set year 2004

set date [clock format [clock scan $year-$month-$day] -format "%B %d, %Y"]

set album_base [join [list $base $year $month $day] "/"]

set album_file $album_base/album

set photo_url [join [list $photo_url $year $month $day] "/"]

# look for album db_file

::photos::get_album_db $album_file T


# now get list of photos
set output ""
set index 0
set next 0
set previous 0
set photos:rowcount 0

set photo_rows [list]

foreach Photo [::rmadilo::tree::findElementRanges T 'photo'] {
    
    if {$index > $end} {
	set next "1"
	break
    }
    if {$index < $start } {
	incr index
	set previous "1"
	continue
    }

    incr photos:rowcount
    lappend photo_rows photos:${photos:rowcount}
    ::rmadilo::tree::get PhotoFile T "tail" $Photo 1
    ::rmadilo::tree::get Title T "title" $Photo 1
    ::rmadilo::tree::get Description T "description" $Photo 1
    set photos:${photos:rowcount}(rownum) ${photos:rowcount}    
    set photos:${photos:rowcount}(file) "$PhotoFile"
    set photos:${photos:rowcount}(index) $index
    set photos:${photos:rowcount}(title) $Title
    set photos:${photos:rowcount}(description) $Description


    foreach directory [list thumbs medium 40pct originals] {
    
	set files_exist [llength [set match_files \
             [glob -nocomplain -tails\
               -directory $album_base/$directory ${PhotoFile}*]]]
	
	if {$files_exist > 0} {
	    set photos:${photos:rowcount}($directory) 1 
	    set photos:${photos:rowcount}(${directory}Photo) "$photo_url/$directory/[lindex $match_files 0]"
	} else {
	    set photos:${photos:rowcount}($directory) 0
	    set photos:${photos:rowcount}(${directory}Photo) "/images/blank.gif"
	}

    }
   
    incr index
}


# calculate navigation
if {$next} {
    set nextend [expr $end + $show]
    set nextstart [expr $start + $show]
} 

if {$previous} {
    set prevend [expr $end - $show ]
    set prevstart [expr $start - $show ]
    if {$prevstart < 0} {
	set prevstart 0
    }
}

# for returning to thumbnail browse
set thumbstart [expr $index -2 ]
set thumbend [expr $index + 1]

# If only one photo is displayed, set page title to photo title, if non-empty
if { $show == 1 && ![string equal "" "${photos:1(title)}"] } {
    set title "${photos:1(title)} -- $date"
} else {
    set title "Album for $date"
}


source $vhost_root/www/photos/album.cmp

ns_return 200 text/html $string