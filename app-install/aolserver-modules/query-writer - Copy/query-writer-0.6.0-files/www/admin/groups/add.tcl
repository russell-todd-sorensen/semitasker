ad_page_contract {

    Query Writer Add Group
    @author Tom Jackson <tom@junom.com>
    @creation-date 22 February 2002
    @cvs-id $Id: add.tcl,v 1.2 2002/02/22 10:02:04 nsadmin Exp $
} {

} -properties {
    title:onevalue
    context_bar:onevalue
    groups:multirow
}


set context_bar  [ad_context_bar_ws [list  "../index" "Query Writer Index"] [list "index" "Group Index"] "Add Group"]

set title "Add Group"

db_multirow groups qw_group_qry "
select
 * 
from
 qw_groups
order by
 name"
