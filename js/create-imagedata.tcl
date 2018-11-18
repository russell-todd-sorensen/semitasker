set directory [file dirname [ns_url2file [ns_conn url]]]
set imageDirectory [file normalize [file join $directory ../images/mset/]]
set imageFiles [glob -nocomplain -tails -directory $imageDirectory *.png ]
set javascript "var HomepageData = {};
HomepageData.url = document.url;
HomepageData.Restored = {};
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
foreach image $imageFiles {
    lappend imageList "{url: '/images/mset/$image', alt: '$image'}"
}
append javascript [join $imageList ",\n"]
append javascript "\];"
ns_return 200 text/javascript $javascript
