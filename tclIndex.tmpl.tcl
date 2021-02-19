#[comment {
#   Testing file for glob-to and file-to commands
#
#   Note: file-to and glob-to are dangerous commands
#   which should probably be removed from safe templates.
#
#}/]

set directory $page
set dir $directory
set title "Contents of $url"
set shortTitle "Contents of [file tail $url]"
set mainCssExists [file exists $dir/main.css]
set title $inspectUrl

if {$mainCssExists} {
 set mainCss "main-index.css"
 set imagesCss "images.css"
} else {
 set mainCss "/main-index.css"
 set imagesCss "/images.css"
}

append __string "<html lang='en_US'>
<head>
 <meta charset='utf-8'>
 <title>$title</title>
 <link rel='stylesheet' type='text/css' href='$mainCss' media='all'>
 <style type='text/css'>

table.dir {
    margin: 10px;
}

table.dir, table.files {
   width: 80%;
}

.dir th, .files th {
  text-align: left;
  background-color: silver;
  text-transform: capitalize;
  font-weight: bold;
}

.dir td a {
  padding-left: 30px;
}

.num {
  text-align: right;
}
 </style>

 <script language='javascript' src='/js/jquery-v141.js'></script>
 <script language='javascript'>
 
 var log;
\$(document).ready(function() {

  log = \$('#log');	 
  var titleNode = \$('h1#title');
  titleNode.wrap(\"<div class='content2' id='content4'>\");

});
</script>
</head>
<body>
$summary
<div class='nav'>
  <li><a href='/'>home page</a> &gt;</li>
"

set path "/"
foreach element $urlv {
  append path $element "/"
  append __string "  <li><a href='$path'>$element</a> &gt;</li>
"
}
  
append __string "  <li>$shortTitle</li>
</div>

<div id='content'>
 <h1 id='title'>$shortTitle</h1>
"

set file_list [lsort [glob -nocomplain -directory $directory/ -type f * ]]
set dir_list  [lsort [glob -nocomplain -directory $directory/ -type d * .* ]]

append __string "
<table class='dir' cellspacing='0' cellpadding='2' border='0'>
 <tr>
  <th>directories</th>
  <th>last modified</th>
  <th>size</th>
 </tr>"
 
foreach dirname $dir_list {
     set tail [file tail $dirname]
     file stat $dirname dirArray
     append __string "
  <tr>
   <td><a href='${tail}/' class='dir'>$tail</a></td>
   <td>[clock format $dirArray(mtime) -format "%Y-%m-%d %H:%M:%S" ]</td>
   <td class='num'>$dirArray(size) Bytes</td>
 </tr>
"
}
append __string "
 <tr>
  <th>files</th>
  <th>last modified</th>
  <th>size</th>
 </tr>"
 
foreach obj $file_list {
    set tail [file tail $obj]
    file stat $obj fileArray
    set file_extension [string trimleft [file extension $tail ] "."]

    switch -glob -- "$file_extension" {
        "*~" - "*.o" {
        }
        default {
            append __string "
  <tr>
   <td><a href='${tail}' class='$file_extension'>[string range $tail 0 50]</a></td>
   <td>[clock format $fileArray(mtime) -format "%Y-%m-%d %H:%M:%S" ]</td>
   <td class='num'>"

            set size $fileArray(size)
            set sizeOriginal $size
            if {$size  <= 1024 } {
                append __string "$size Bytes"
            } elseif {($size / 1024.0) <= 1024} {
                set size [expr {$size/1024}]
                set size [format %3d $size]
                append __string "[string map {" " "&nbsp;"} $size] KBytes ($sizeOriginal)"
            } elseif {($size / (1024*1024)) <= 1024} {
                append __string "[expr {$size/(1024*1024)} ] MBytes ($sizeOriginal)"
            }
            append __string "</td>
  </tr>"

       }
    }
}

append __string "
</table>
</div>

<div class='bottom'>
 <hr>
 <address><a href='mailto:russell@ic00408.cst.edu'>Russell Sorensen</a></address>
 "
set script [info script]
set mtime [file mtime $script]
set clockTime [clock format $mtime -format "%+"]

append __string "
<!-- Created $clockTime -->

<span class='lastMod'>Last modified $clockTime</span>
<pre id='log'>Log</pre>
 <div id='footer'>
  <div class='nav'>
   <li>\[<a href='..'>..</a>\] |</li>
   <li>\[<a href='.'>.</a>\]</li>
  </div>
 </div>
</div>

</body>
</html>"