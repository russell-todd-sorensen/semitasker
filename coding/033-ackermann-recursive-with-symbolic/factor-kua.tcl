
namespace eval ::kua {

    variable sym

    set sym(phi) φ
    set sym(alpha) α

    set sym(ua) ↑
    set sym(ua2) ꜛ

    # https://www.compart.com/en/unicode/block/U+2190

    set sym(ua3) ↑ ;# https://www.compart.com/en/unicode/U+2191
    set sym(ra) →  ;# https://www.compart.com/en/unicode/U+2192
    set sym(uda) ⇑ ;# https://www.compart.com/en/unicode/U+21D1
    set sym(uda2) ⇧ ;# https://www.compart.com/en/unicode/U+21E7

    variable factors
    set factors(2**2) [list 2 $sym(uda) 2]
    set factors(2**2**2) [list 2 $sym(uda) 3]
    set factors(2**2**2**2) [list 2 $sym(uda) 4]
    set factors(2**2**2**2**2) [list 2 $sym(uda) 5]

    variable values 
    set values($factors(2**2)) [expr {2**2}]
    set values($factors(2**2**2)) [expr {2**2**2}]
    set values($factors(2**2**2**2)) [expr {2**2**2**2}]
    set values($factors(2**2**2**2**2)) [expr {2**2**2**2**2}]




}

# hyper operations
namespace eval ::h {

    variable ops [list + * ↑ ↑↑ ↑↑↑ ↑↑↑↑ ↑↑↑↑↑ ↑↑↑↑↑↑]

}

proc ::h::value {in maxInt} {
    set len [llength $in]



}

proc ::kua::factor {value} {

    variable factors

}