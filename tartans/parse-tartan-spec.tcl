set Data {Name "Keith Clan"

Threadcount
K8WG36FSB16K16FSB12K16FSB16WG36

Pallet
"K=101010BLACK;FSB=2474E8FS BLUE;WG=408060WTHRD GREEN;NB=003C64NAVY BLUE;DBG=005448DARK BLUE GREE;BN=14283CBLUE GREY;o=34000C1188;"
}

set Data {Name "Marshall of Keith"


Threadcount
PB20K20PB20MG52Y10

Pallet
PB=3F0FFEBLUE;K=101010BLACK;MG=003C14GREEN;Y=E8C000YELLOW;
}
set Data {Name "Alexander of Menstry Hunting"
Threadcount
LP10WG4LP4WG52K18LN18LSB26WW10

Pallet
"A=5C8CA8AZURE;LP=B468ACMAUVE;CLR=E87878CORAL;WW=F8F8F8WILSON WHITE;B=2C2C80BLUE;LN=A0A0A0LIGHT GRAY;N=888888GRAY;K=101010BLACK;G=006818GREEN;P=780078PURPLE;WG=408060WTHRD GREEN;LSB=98C8E8LIGHT SKY;"
}

array set Tartan $Data

set pallet [split $Tartan(Pallet) ";"]

puts "Name=$Tartan(Name),
Threadcount=$Tartan(Threadcount)
Pallet=$Tartan(Pallet)"

foreach color $pallet {
    set KV [split $color "="]
    puts "symbol = '[lindex $KV 0]', value='#[string range [lindex $KV 1] 0 5]', name='[string range [lindex $KV 1] 6 end]'"
}



foreach color $pallet {
    set KV [split $color "="]
    set symbol [lindex $KV 0]
    set hex [string range [lindex $KV 1] 0 5]
    set colorName [string range [lindex $KV 1] 6 end]
}


if {false} {

var Tartan = function ()



}
