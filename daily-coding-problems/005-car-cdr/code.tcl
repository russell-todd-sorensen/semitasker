
if {[namespace exists ::Node]} {
    namespace delete ::Node
}

namespace eval :: {
    source "d:/git-repos/wtk/init.tcl"
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


set one [<< ::Cons::Cons -a e  -b 4 >>]

ns_return 200 text/plain [<< $one.a >>]