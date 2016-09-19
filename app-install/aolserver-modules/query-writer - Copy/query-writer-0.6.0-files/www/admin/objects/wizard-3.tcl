ad_page_contract {

    Query Writer Wizard 3 Add/Choose Groups
    @author Tom Jackson <tom@junom.com>
    @creation-date 2003 July 21
    @cvs-id $Id: wizard-3.tcl,v 1.1 2003/07/28 21:51:21 tom Exp $
} {
    object_id:notnull
} -properties {
    title:onevalue
    context_bar:onevalue
    groups:multirow
}


set context_bar ""
set title "Object Wizard Step 3: Add/Choose Groups"

db_multirow groups qw_group_qry "
select
 * 
from
 qw_groups
order by
 name"
