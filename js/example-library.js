
// sets the background of id using input image url 
function changeBackground(input, id) {
 
    var image = $(input).val();
    Log.Notice("image=" + image);
    re = /^(C:\\fakepath\\)(.*)$/;
    
    if (image.match(re)) {
        var matched = image.match(re);
        if (matched.length > 2) {
            var url = "images/" + matched[2];
        } else {
            return null;
        }
    } else {
        var re = /\\(images\\[a-zA-Z0-9\\\s\._-]+)$/;
        var re2 = /\\/g;
        var matched = image.match(re);
        Log.Notice("matched=" + matched[1]);

        if (matched.length > 1) {
            var url = matched[1].replace(re2, "/");
        } else {
            return null;
        }
    }

    Log.Notice("url=" + url);

    $(id)
        .css('background-image', 'url(' + url + ')');

    return url;
}
