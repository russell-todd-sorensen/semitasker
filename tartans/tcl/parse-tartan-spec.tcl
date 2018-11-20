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

set output ""

set Data {Name Aberdeen
Threadcount
"WW4C6R46WW4K32LG8WW2R12C6WW2C6R12WW2A20WW4P6R16C6WW4C6R16P6WW4K24LG8K24WW4P6R16C6WW4C6R16P6WW4P12A8WW4A8P12WW4K32LG8WW4LG8K32WW4P12A8WW4A8P12WW4P6R16C6WW4C6R16P6WW4K24LG8K24WW4P6R16C6WW4C6R16P6WW4A20WW2R12C6WW2C6R12WW2LG8"

Pallet
"P=780078PURPLE;A=5C8CA8AZURE;LG=289C18LIGHT GREEN;K=101010BLACK;R=C80000RED;C=A00048CRIMSON;WW=F8F8F8WILSON WHITE;"
}

array set Tartan $Data

set pallet [split $Tartan(Pallet) ";"]

set output ""

append output "Name=$Tartan(Name),
Threadcount=$Tartan(Threadcount)
Pallet=$Tartan(Pallet)"

foreach color $pallet {
    set KV [split $color "="]
    append output "symbol = '[lindex $KV 0]', value='#[string range [lindex $KV 1] 0 5]', name='[string range [lindex $KV 1] 6 end]'"
}


foreach color $pallet {
    set KV [split $color "="]
    set symbol [lindex $KV 0]
    set hex [string range [lindex $KV 1] 0 5]
    set colorName [string range [lindex $KV 1] 6 end]
}


ns_return 200 text/plain "pallet = $Tartan(Pallet)
Pallet=$pallet
Threadcount=$Tartan(Threadcount)
Name=$Tartan(Name)


output=$output"
