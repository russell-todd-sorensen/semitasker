
proc Resume {what args} {
    uplevel 1 yieldto $what {*}$args
}

proc Call {what args} {
    uplevel 1 $what {*}$args
}

proc Detach {args} {
    uplevel 1 yield {*}$args
}


namespace eval ::fib {
    variable F1; # used with global version
    variable F2; # used with global version

    proc Fibonacci {} {
        set F1 0;
        set F2 1;

        Detach

        while {"True"} {
            Detach $F2;
            set F2 [expr {$F2 + $F1}];
            set F1 [expr {$F2 - $F1}];
        }
    }

    proc FibonacciTest {} {

        coroutine F Fibonacci;
        
        for {set i 0} {$i < 20} {incr i} {
            puts stdout "$i [Call F]";
        }
    }

    proc FibonacciTestToN {{n 20}} {
        if {$n <2} {
            set n 2;
        } elseif {$n > 100} {
            set n 100;
        }

        coroutine Fn Fibonacci;

        for {set i 0} {$i < $n} {incr i} {
            puts stdout "$i [Call Fn]";
        }
    }

    proc FibonacciDetach {} {
        variable F1 0;
        variable F2 1;

        Detach;

        while {"True"} {
            Detach;
            set F2 [expr {$F2 + $F1}];
            set F1 [expr {$F2 - $F1}];
        }
    }

    proc FibonacciTestGlobals {{n 20}} {
        variable F2;

        if {$n <2} {
            set n 2;
        } elseif {$n > 100} {
            set n 100;
        }

        coroutine Fng FibonacciDetach;

        for {set i 0} {$i < $n} {incr i} {
            Call Fng;
            puts stdout "$i $F2";
        }
    }

    coroutine fib FibonacciTest;
    coroutine fibn FibonacciTestToN 111;
    coroutine fibng FibonacciTestGlobals 20;
}
