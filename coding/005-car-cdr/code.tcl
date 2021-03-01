
if {[namespace exists ::Cons]} {
    namespace delete ::Cons
}

namespace eval :: {
    #source "/web/git-repos/wtk/init.tcl"
}

<< Class ::Cons::Pair \
    -ObjNameFormat CONS_PAIR%0.3i \
    -ObjCounter 0 \
    -VARIABLES {{car "" - {}} {cdr "" - {}}} \
    +METHODS car \
    +METHODS cdr \
>>

proc ::Cons::Cons {car cdr} {
    return [<< ::Cons::Pair -car $car -cdr $cdr >>]
}

<< ::Cons::Pair.method car {} {
    variable car
    return $car
} PUBLIC >>

<< ::Cons::Pair.method cdr {} {
    variable cdr 
    return $cdr
} PUBLIC >>


set one [<< ::Cons::Pair -car e -cdr 4 >>]

ns_return 200 text/html "
<style>
body {
    font-family: 'Fira Code';
}
</style>
<a href='source.tcl'>Source Code</a><br>
one.car = \[<< \[::Cons::Cons e 4].car >>] =  '\[<< $one.car >>]' ='[<< $one.car >>]'
<br>
next cons = '\[::Cons::Cons x y]' = '[set cons [<< ::Cons::Pair -car x -cdr y >>]]'
<br>
cdr = \[<< $cons.cdr >>] = '[<< $cons.cdr >>]'
<br>"
