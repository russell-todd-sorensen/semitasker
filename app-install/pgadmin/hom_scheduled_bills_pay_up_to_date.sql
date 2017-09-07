update hom_scheduled_bills
 set paid_on = est_due
 where
  paid_on is null
  and
  received_on < '2017-04-12'
  