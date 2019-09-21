
var url1 = ""
var url2 = ""
var url3 = "/image-creation/js/mandelbrot-tile-maker.js"
var res, text;
fetch(
    url1
).then(
    (res) => res.text()
).then(
    (text) => {
        eval(text)
        fetch(
            url2
        ).then(
            (res) => eval(res.text())
        ).then(
            (text) => {
                eval(text)
                fetch(
                    url3
                ).then(
                    (res) => eval(res.text())
                ).then(
                    (text) => {
                        eval(text)
                        console.log('got this far with x');
                        config.captureEnd = null;
                        createPicture();
                    }
                )
            }
        )
    }
);