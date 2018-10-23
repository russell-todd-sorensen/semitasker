create table hom_interview_questions (

    column_sort_order integer not null,
    column_name varchar(63) not null primary key,
    column_title varchar(127) not null,
    column_help varchar(255) not null,
    column_enabled boolean not null default true,
    column_length integer not null default 1,
    column_type varchar(63) not null default 'text',
    column_data varchar(1023) default null
);

insert into hom_interview_questions values
(1,'applicant_name','Participant Name','Name of Applicant',true,64,'text',''),
(2,'doc','DOC #/ID','DOC number or Offender Id',true,64,'text',''),
(3,'date_of_interview','Date of Interview','Date interview was conducted by HOM',true,64,'date','blank'),
(4,'time_of_interview','Time of Interview','Time interview was conducted by HOM',true,64,'time','blank'),
(6,'location','Location Being Housed','',true,1,'select','<%= $houseOptionString %>'),
(7,'county_applied_for','County applied for','Which county',true,1,'select','King,Pierce,Snohomish,Spokane,Yakima'),
(8,'out_of_county','Out of County','??',true,1,'radio','Yes,No'),
(9,'level','Level','Sex Offender Level',true,1,'select','1,2,3,N/A'),
(10,'isrb_releasable','ISRB Releasable','Has the applicant been found releasable by the ISRB?',true,1,'radio','Yes,No,N/A'),

(11,'age','Age','Age of Applicant',true,2,'integer','18,99'),
(12,'time_in_prison','Time in Prison','Time served by offender.',true,16,'text',''),
(13,'criminal_history','Criminal History','Applicants criminal history.',true,128,'textarea','5,40'),
(14,'drug_alcohol_use','Drug &amp; Alcohol Use','Past drug use of applicant',true,128,'textarea','3,40'),
(15,'clean_days','Clean Days','Maximum number of clean days while not incarcerated.',true,16,'text',''),
(16,'sotp_required','SOTP','Is offender required to take SOTP upon release',true,1,'radio','Yes,No'),
(17,'infraction_history','Infractions','Infractions offender committed during time in prison.',true,128,'textarea','4,40'),
(18,'triggers','Triggers','Ask applicant to explain any triggers to returning to past behaviors.',true,128,'textarea','4,40'),
(19,'avoiding_triggers','Avoiding Triggers','What has applicant done to keep from falling into cycle.',true,128,'textarea','4,40'),

(20,'travel','Travel Arrangements','How is the applicant planning on getting from prison to HOM.',true,128,'textarea','4,40'),
(21,'pay_method','Method of Payment','How is the applicant planning on paying program fees.',true,64,'text',''),
(22,'photos','Photos','Can we get a current photo from the applicant.',true,1,'radio','Yes,No'),

(23,'program_stipulations','Program Stipulations','Has the offender agreed to the program stipulations?',true,1,'checkbox','Yes'),
(24,'mandatory_meetings','Mandatory Meetings','Inform applicant of the three mandatory meetings.',true,1,'radio','Agrees,does not agree'),
(25,'curfew','Curfew','Inform applicant of curfew stipulations, set initial curfew.',true,128,'text',''),
(26,'shared_rooms','Shared Rooms','Inform applicant of shared living arrangements.',true,1,'checkbox','Yes'),
(27,'house_leaders','House Leaders','Explain House Leaders to applicant',true,1,'checkbox','Yes'),

(28,'approved','Approved','Accepted into HOM Program',true,1,'radio','Yes,No'),
(29,'housing_roster','Housing Roster','What is this??',true,1,'checkbox','Yes'),
(30,'point_of_contact','Point of Contact','Pastor James is the Point of Contact.',true,1,'checkbox','Yes'),

(31,'counselor','Counselor','Name of offender&apos;s counselor.',true,128,'text',''),
(32,'counselor_phone','Counselor&apos;s Phone Number','Phone number of offender&apos;s counselor.',true,64,'text',''),
(33,'counselor_email','Counselor&apos;s Email','Email address of offender&apos;s counselor.',true,64,'text',''),
(34,'confirmation_email','Confirmation Email Sent','Confirm sending counselor email.',true,1,'radio','Yes,No'),
(35,'finalize','Save to Database','Save the interview to the database.',true,1,'button','submitForm("form1"),')
