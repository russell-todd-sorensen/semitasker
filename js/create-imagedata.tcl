set directory [file dirname [ns_url2file [ns_conn url]]]
set imageDirectory [file normalize [file join $directory ../images/mset-opt/]]
ns_log Notice "imageDirectory='$imageDirectory'"
set imageFiles [glob -nocomplain -tails -directory $imageDirectory *.png ]
set javascript "var HomepageData = {};
HomepageData.url = document.url;
HomepageData.Restored = {};
// imageDirectory=$imageDirectory
HomepageData.fontFamily = \[
    'Agency FB Bold',
    'Agency FB',
    'Bauhaus 93',
    'Consolas',
    'Consolas Bold',
    'Cooper Black',
\];

HomepageData.Images = \[
"
set imageList [list];
foreach image $imageFiles {
    lappend imageList "\{url: '/images/mset-opt/$image', alt: '$image'\}"
}
append javascript [join $imageList ",\n"]
append javascript "\];"
ns_return 200 "text/javascript; charset=utf-8" $javascript
