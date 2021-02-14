ad_page_contract {

    Query Writer Admin Pick Group
    @author Tom Jackson <tom@junom.com>
    @creation-date 21 February 2002
    @cvs-id $Id: pick.tcl,v 1.1 2002/02/22 09:29:52 nsadmin Exp $
} {
    object_id:trim,notnull
    final_form:trim,notnull
} -properties {
    title:onevalue
    context_bar:onevalue
    final_form:onevalue
    groups:multirow
}


set context_bar  [ad_context_bar_ws [list "../index" "Query Writer Index"] [list "index" "Group Index"] "Pick Group"]

set title "Query Writer Pick Group"


db_multirow groups group_query "
select
 group_id,
 name
from 
 qw_groups
order by
 name"


set form_vars [export_form_vars object_id]