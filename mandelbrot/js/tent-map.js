//#include <stdio.h>
//#include <stdlib.h>
//#include <time.h>
/* 

https://math.stackexchange.com/questions/2453939/is-this-characteristic-of-tent-map-usually-observed

 gcc t.c -Wall
a@zelman:~/c/varia/tent$ ./a.out



*/



/* ------------ constans  ---------------------------- */
//double m = 2.0; /* parameter of tent map */
//double a = 1.0; /* upper bound for randum number generator */
//int iMax = 100;
/* ------------------- functions --------------------------- */


/* 

tent map 



double f(double x0, double m){

    double x1;
    if (x0 < 0.5) 
        x1 = m*x0;
        else x1 = m*(1.0 - x0);
    return x1;

}

*/


var tentMap = function(x0,m,r) {
    r = r?r:1
    let x1;

    if (x0 < 0.5) {
        x1 = m*r*x0;
    } else {
        x1 = m*r*(1.0-x0);
    }
    return x1;
}


/* random double from 0.0 to a 
https://stackoverflow.com/questions/13408990/how-to-generate-random-float-number-in-c



double GiveRandom(double a){
    srand((unsigned int)time(NULL));
    
    return  (((double)rand()/(double)(RAND_MAX)) * a);

}

*/
var RAND_MAX = 1.0
var GiveRandom = function (a) {
    let randArray = new Uint32Array(1);
    window.crypto.getRandomValues(randArray);

    return ((randArray[0]/Math.pow(2,32))*a);
}


/*

int main(void){

    int i = 0;
    double x = GiveRandom(a); //* x0 = random 
    
    for (i = 0; i<iMax; i++){
    
        printf("i = %3d \t x = %.16f\n",i, x);
        x = f(x,m); //* iteration of the tent map 
    }

    return 0;
}

*/

var mainFunction = function (max,pow,r) {
        pow = pow?pow:0
        r = r?r:1
    let i = 0,
        m = 2.0,
        x = GiveRandom(1.0)/Math.pow(10,pow),
        prev = x,
        diff;

    for (;i<max;i++) {
        diff = Math.abs(prev-x)
        console.log(`i=${i}\t x=${x}\t gap=${diff}`);
        prev = x;
        x = tentMap(x,m,r)
    }
};
