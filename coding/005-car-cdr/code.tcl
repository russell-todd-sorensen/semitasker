
if {[namespace exists ::Node]} {
    namespace delete ::Node
}

if {[namespace exists ::Cons]} {
    namespace delete ::Cons
}

namespace eval :: {
    source "/web/git-repos/wtk/init.tcl"
}

<< Class ::Cons::Cons \
    -ObjNameFormat CONS_CONS%0.3i \
    -ObjCounter 0 \
    -VARIABLES {{a} {b}} \
    +METHODS a \
    +METHODS b \
>>

<< ::Cons::Cons.method a {} {
    variable a
    return $a
} PUBLIC >>

<< ::Cons::Cons.method b {} {
    variable b 
    return $b
} PUBLIC >>


set one [<< ::Cons::Cons.new -a e -b 4 >>]

ns_return 200 text/plain [<< $one.a >>]