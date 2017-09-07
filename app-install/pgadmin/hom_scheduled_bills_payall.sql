update hom_scheduled_bills
 set received_on = est_received_by,
  actual_due = est_due,
  paid_on = est_due
 where
  received_on is null
  and
  actual_due is null
  AND
  est_due < '2017-06-15'
  