update
--SELECT *  from 
 hom_scheduled_bills
set 
 paid_on = est_due
where
  paid_on is null
AND 
 actual_due is not null
and
 est_due < '2017-06-17'
  