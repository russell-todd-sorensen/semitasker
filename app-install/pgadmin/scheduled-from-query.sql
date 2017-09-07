select
 sb.schedule_id,
 sb.scheduled_from, 
 sb.account_id,
 va.vendor_id,
 va.recur_type_id,
 va.notice_days,
 sb.est_due,
 sb.est_received_by,
 sb.received_on,
 sb.actual_due,
 rt.frequency,
 rt.recur_name,
 max(sb.paid_on) as last_paid,
 (sb.est_due - sb.actual_due)/2  as gap,
 sb.actual_due + (sb.est_due - sb.actual_due)/2  as new_est_due,
 (sb.actual_due + (sb.est_due - sb.actual_due)/2) + (360 / rt.frequency) as next_est_due,
 (sb.actual_due + (sb.est_due - sb.actual_due)/2) + (360 / rt.frequency) - va.notice_days as next_est_receive
from
 hom_scheduled_bills sb
LEFT OUTER JOIN
 hom_vendor_accounts va
ON
 sb.account_id = va.account_id
LEFT OUTER JOIN
 hom_recurrence_types rt
ON
 va.recur_type_id = rt.recur_type_id
where
  sb.paid_on is not null
AND
  va.recur_type_id > 0
group by
 sb.schedule_id,
 sb.scheduled_from,
 sb.account_id,
 va.vendor_id,
 va.recur_type_id,
 va.notice_days,
 sb.est_due,
 sb.est_received_by,
 sb.received_on,
 sb.actual_due,
 rt.frequency,
 rt.recur_name,
 sb.paid_on
 ORDER BY 
 sb.scheduled_from ASC;