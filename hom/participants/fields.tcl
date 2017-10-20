set fields {
	{Name name varchar(41) ""}
	{Refnum ref integer ""}
	{Timestamp tmst integer ""}
	Baddr1
	Baddr2
	Baddr3
	Baddr4
	Baddr5
	Saddr1
	Saddr2
	Saddr3
	Saddr4
	Saddr5
	Phone1
	Phone2
	Faxnum
	Email
	Note
	Cont1
	Cont2
	Ctype
	Terms
	Taxable
	SalesTaxCode
	Limit
	ResaleNum
	Rep
	Taxitem
	Notepad
	Salutation
	CompanyName
	Firstname
	{Midinit mi varchar(5) ''}
	Lastname
	Custfld1
	Custfld2
	Custfld3
	Custfld4
	Custfld5
	Custfld6
	Custfld7
	Custfld8
	Custfld9
	Custfld10
	Custfld11
	Custfld12
	Custfld13
	Custfld14
	Custfld15
	Jobdesc
	Jobtype
	Jobstatus
	{Jobstart jstart date '2000-01-01'}
	{JobProgEnd jpend date '2000-01-01'}
	{JobEnd jend date null}
	{Hidden hidden char(1) 'N'} 
	Delcount
	Pricelevel
	{last_modified lmod date '2000-01-01'}
}

set sql "create table hom_part_qb (\n"
set field_name ""
set field_abbrev ""
set field_type ""
set fieldsList [list]
set default_value {""}
set output ""
set count 1
foreach field $fields {
	if {[llength [split $field]] > 1} {
		#lassign [split $field] field_name field_abbrev field_type default_value
		set field_name [lindex $field 0]
		set field_abbrev [lindex $field 1]
		set field_type [lindex $field 2]
		set default_value [lindex $field 3]
		ns_log Notice "*********** field='$field' split='[split $field]'"
	} else {
		set field_name $field
		set field_abbrev $field
		set field_type "varchar(31)"
		set default_value "''"
	}
	if {"$default_value" ne ""} {
		set default_value " default $default_value"
	}
	

	set final_field_name part_[string tolower $field_name]
	lappend fieldsList "  $final_field_name $field_type$default_value"
	ns_log Notice "count='$count' ffn='$final_field_name' ft='$field_type' dv='$default_value' abbrev='$field_abbrev'\n"
	incr count
	
}

append sql [join $fieldsList ",\n"]
append sql "\n);"

ns_return 200 text/plain $output$sql