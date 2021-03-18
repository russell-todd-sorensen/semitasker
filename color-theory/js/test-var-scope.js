
var myfunc = function (arg1, arg2, arg3) {
    let sum1 = arg1 + arg2,
        sum2 = arg2 + arg3;
    var sum3 = arg1 + arg2,
        sum4 = arg2 + arg3;

    for (let i=0;i<1;i++) {
        let sum1 = 2 + 3;
        let sum2 = 4 + 5;
        let sum3 = 6 + 7;
        let sum4 = 8 + 9;
    }

    for (let i=0;i<1;i++) {
        var sum1 = 2 + 3;
        var sum2 = 4 + 5;
        var sum3 = 6 + 7;
        var sum4 = 8 + 9;
    }

    for (let i=1;i<2;i++) {
        console.log("sum1=" + sum1)
        console.log("sum2=" + sum2)
        console.log("sum3=" + sum3)
        console.log("sum4=" + sum4)
    }
}

