source test.tcl

# Example of the cordb.cor_identities table:
set db2 [<< ::wtk::cor::Database -name mydb -abbrev mydb >>]

set mydbSchema [<< ::wtk::cor::Schema -name cordb -abbrev "" >>]

<< $db2.addSchema $mydbSchema >>

set myModule [<< ::wtk::cor::Module -name cor -abbrev cor >>]

<< $mydbSchema.addModule $myModule >>

set corTables [list]

# Classes table:

lappend corTables [<< ::wtk::cor::Table\
		       -name classes\
		       -abbrev cla\
		       -primaryKeys {class_id}\
		       +tableConstraints {pk {class_id}}\
		       +comments "COR Classes table" >>]

<< [lindex $corTables end].addColumns {
    {class_id integer {{nn ""}}}
    {class_name "varchar(128)" {{nn ""} {un ""}}}
    {class_desr "varchar(1024)" {{nn ""}}}
    {class_table "name" {{nn ""}}}
} >>

lappend corTables [<< ::wtk::cor::Table\
		       -name objects\
		       -abbrev obj\
		       -primaryKeys {object_id}\
		       +comments "COR Objects table" >>]

<< [lindex $corTables end].addColumns {
    {object_id integer {{pk ""} {nn ""}}}
    {class_id integer {{fk {cor_classes}} {nn ""}}}
    {obj_owner integer {{df 100} {nn ""}}}
    {create_date timestamptz {{df {now()}} {nn ""}}}
    {change_date timestamptz {{df {now()}} {nn ""}}}
    {object_descr text {{nn ""}}}
} >>

lappend corTables [<< ::wtk::cor::Table\
		       -name attribute_types\
		       -abbrev cat\
		       -primaryKeys {attr_type_id}\
		       +comments "COR Attributes Table" >>]

<< [lindex $corTables end].addColumns {
    {attr_type_id integer {{pk ""} {nn ""}}}
    {attr_type_name "varchar(255)" {{nn ""}}}
    {attr_sql_type "varchar(255)" {{nn ""}}}
    {attr_type_descr "varchar(255)" {{nn ""}}}
} >>

lappend corTables [<< ::wtk::cor::Table\
		       -name attributes\
		       -abbrev att\
		       -primaryKeys {attribute_id}\
		       +tableConstraints {un {class_id attr_name}} >>]

<< [lindex $corTables end].addColumns {
    {attribute_id integer {{pk ""} {nn ""} {fk {cor_objects object_id}}}}
    {class_id integer {{nn ""} {fk {cor_classes}}}}
    {attr_type_id integer {{nn ""} {fk {cor_attribute_types}}}}
    {attr_order integer {{nn ""} {df 1}}}
    {attr_name "name" {{nn ""}}}
    {attr_comment text {{nn ""}}}
} >>

lappend corTables [<< ::wtk::cor::Table\
		       -name relations\
		       -abbrev rel\
		       -primaryKeys {subject_id predicate_id object_id}\
		       +tableConstraints {pk {subject_id predicate_id object_id}}\
		       +tableConstraints {un {subject_id object_id predicate_id}}\
		       +tableConstraints {un {object_id predicate_id subject_id}} >>]

<< [lindex $corTables end].addColumns {
    {subject_id integer {{nn ""} {fk {objects object_id}}}}
    {object_id integer {{nn ""} {fk {objects object_id}}}}
    {predicate_id integer {{nn ""} {fk {objects object_id}}}}
    {sort_order integer {{nn ""} {df 1}}}
} >>


# Identities table:
lappend corTables [<< ::wtk::cor::Table\
		       -name identities2\
		       -abbrev idt2\
		       -primaryKeys [list identity_id]\
		       +comments "This is the Identities table"\
		       +tableConstraints {un "ident_domain_id ident_login_name"} >>]

<< [lindex $corTables end].addColumns {
    {identity_id integer {{pk ""} {fk "objects object_id"} {nn ""}} }
    {ident_type_id integer {{fk "identity_types type_id"} {nn ""} } }
    {ident_domain_id integer {{fk "domains domain_id"} {df "1"} {nn ""}} }
    {ident_name "varchar(128)" {{nn ""}} }
    {ident_login_name "varchar(128)" {{nn ""}} }
    {ident_password_hash "varchar(512)" {{nn ""} {df "'XXXXXXXX'"}} }
    {ident_password_salt "varchar(512)" {{nn ""} {df "'12345678'"}} }
    {encryption_method integer {{fk "encryption_methods method_id"} {df "1"} {nn ""}} {{Default encryption method is sha1}} }
    {ident_descr text {{nn ""}} }
} >>



    
		       
		       

foreach tableId $corTables {
    << $myModule.addTable $tableId >>
}


::wtk::log::log Notice "\n[<< $db2.printSql >>]"
