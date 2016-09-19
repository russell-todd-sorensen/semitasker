catch {db_dml insert_group "insert into qw_groups (group_id, name) values (
'1','QW Admin')" } 
db_dml insert_qw_object "insert into qw_objects (object_id,object,obj_table,key,
to_eval,set_perm_check,del_perm_check,ops,new_fn,set_fn,del_fn,rst_fn,
perm_p) values ('qw_object','qw_object','qw_objects','object_id',
'','','','new;set;del','','','','',
'0')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'object','qw_object','object',
'The Data Model Object Name.','',
'Name of the object used in dml or pl.','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'table','qw_object','obj_table',
'Object Table Name.','',
'The name of the table where objects are stored.','',
'','30','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'key','qw_object','key',
'The object key attribute','',
'Primary key attribute of the object.','',
'','150','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'ops','qw_object','ops',
'Operations permitted','',
'Semi-colon separated list of permitted operations, such as: ''new;del;set;rst''','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'newfn','qw_object','new_fn',
'New Function Name','',
'Name of the function which creates new objects.','',
'','40','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'setfn','qw_object','set_fn',
'Set Function Name','',
'Name of function that updates object attribute values.','',
'','40','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'delfn','qw_object','del_fn',
'Delete Function Name','',
'Name of function which deletes objects.','',
'','40','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'rstfn','qw_object','rst_fn',
'Reset Function Name','',
'Name of function that sets object attribute values to the default value.','',
'','40','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'permp','qw_object','perm_p',
'Permission Check','1',
'Flag to specify permission checking via permission_p.','integer',
'1;0','1','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'setperms','qw_object','set_perm_check',
'Update Permission Checks','',
'Additional permission checks during updates.','',
'','256','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'delperms','qw_object','del_perm_check',
'Delete Permission Checks','',
'Extra permission checks on object delete.','',
'','256','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'id','qw_object','object_id',
'Form variable object ID.','',
'The object part of a form variable name.','',
'','100','integer')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'eval','qw_object','to_eval',
'Statements to eval after all variables set.','',
'Attribute Name;eval statement pairs, separated by semi-colon.','',
'','0','text')"
db_dml insert_qw_object "insert into qw_objects (object_id,object,obj_table,key,
to_eval,set_perm_check,del_perm_check,ops,new_fn,set_fn,del_fn,rst_fn,
perm_p) values ('qw_attr','qw_attr','qw_attrs','attr_id;object_id',
'','','','new','','','','',
'0')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'attr','qw_attr','attr',
'Attribute','',
'Name of the attribute used in dml and pl.','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'description','qw_attr','description',
'Description','',
'The description of the attribute.','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'default','qw_attr','default_value',
'Default Value','',
'The default value of the attribute to be used if no value is given, or for resetting the attribute.','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'values','qw_attr','values',
'Values','',
'A semi-colon separated set of possible values for the attribute. This is useful in the case of a limited number of values where some values cannot be accessed by all groups.','',
'','1000','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'id','qw_attr','attr_id',
'Form variable attribute ID','',
'The attribute part of the form variable name.','',
'','100','integer')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'objectid','qw_attr','object_id',
'Object ID','',
'ID of object this attribute belongs to.','',
'','100','integer')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'length','qw_attr','length',
'Max Attribute Length','',
'The maximum attribute length for char and varchar data types. A length filter will be run if the length is greater than zero.','integer',
'','0','integer')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'help','qw_attr','help_text',
'Help Text','',
'Text that would help a user fill out a form correctly or to explain the meaning of an attribute.','',
'','0','text')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'datatype','qw_attr','datatype',
'datatype','''varchar''',
'','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'attr_table','qw_attr','attr_table',
'attribute table','',
'','',
'','64','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'filters','qw_attr','filters',
'Attribute filters','',
'','',
'','1000','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'attr_order','qw_attr','attr_order',
'Attribute order','',
'','integer',
'','0','integer')"
db_dml insert_qw_object "insert into qw_objects (object_id,object,obj_table,key,
to_eval,set_perm_check,del_perm_check,ops,new_fn,set_fn,del_fn,rst_fn,
perm_p) values ('qw_group','qw_group','qw_groups','group_id',
'','','','new;set;del','','','','',
'0')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'name','qw_group','name',
'Group Name','',
'The name of the group.','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'id','qw_group','group_id',
'Group ID','',
'A small integer identifying the group.','integer',
'','0','integer')"
db_dml insert_qw_object "insert into qw_objects (object_id,object,obj_table,key,
to_eval,set_perm_check,del_perm_check,ops,new_fn,set_fn,del_fn,rst_fn,
perm_p) values ('qw_group_attr_map','qw_ga_mp','qw_group_attr_map','group_id;object_id;attr_id',
'','','','new','','','','',
'0')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'values','qw_group_attr_map','values',
'Attribute Values','',
'The possible values this group can update or create. Use this if the values allowed for a group are limited.','',
'','1000','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'ops','qw_group_attr_map','ops',
'Operations','',
'The operations allowed to be performed by the group on this attribute.','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'gid','qw_group_attr_map','group_id',
'Group ID','',
'The Group ID to map.','integer',
'','0','integer')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'oid','qw_group_attr_map','object_id',
'Object ID','',
'The Object ID to map.','',
'','100','integer')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'aid','qw_group_attr_map','attr_id',
'Attribute ID','',
'The Attribute ID to map.','',
'','100','integer')"
db_dml insert_qw_object "insert into qw_objects (object_id,object,obj_table,key,
to_eval,set_perm_check,del_perm_check,ops,new_fn,set_fn,del_fn,rst_fn,
perm_p) values ('fn_types','fn_types','qw_fn_types','type',
'','','','new;set;del','','','','',
'0')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'name','fn_types','name',
'Type Name','',
'The type of function.','',
'','30','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'description','fn_types','description',
'Type Description','',
'The description of the function type.','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'type','fn_types','type',
'Function Type ID','',
'The identifier for the function type.','integer',
'','0','integer')"
db_dml insert_qw_object "insert into qw_objects (object_id,object,obj_table,key,
to_eval,set_perm_check,del_perm_check,ops,new_fn,set_fn,del_fn,rst_fn,
perm_p) values ('qw_fn','qw_fn','qw_fns','fn_id',
'fn_id;set fn_id \[db_string fn_nextval \"select nextval(''qw_fn_sequence'')\"\]','','','new;set;del','','','','',
'0')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'name','qw_fn','name',
'Function Name','',
'Actual name of the function. This could be ''new'' or ''fn__new'' or ''fn.new''.','',
'','30','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'description','qw_fn','description',
'Function Description','',
'The description of what the function does.','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'joiner','qw_fn','joiner',
'Joiner Characters','null',
'Characters with join the object and the function name to form the full function name. Oracle uses a joiner of ''.'' and in OACS postgresql a joiner of ''__'' is used. No Joiner implies that the full name is obtained without reference to the object, only the name attribute of qw_fns.','',
'','10','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'id','qw_fn','fn_id',
'Function ID','',
'The function identifier.','integer',
'','0','integer')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'oid','qw_fn','object_id',
'Object ID','',
'The object id this function applies to.','',
'','100','integer')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'active','qw_fn','active_p',
'Active','''0''',
'If the function is active, and should be used.','integer',
'0;1','0','integer')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'type','qw_fn','type',
'Function Type','',
'The type of function: new set del rst, etc.','integer',
'','0','integer')"
db_dml insert_qw_object "insert into qw_objects (object_id,object,obj_table,key,
to_eval,set_perm_check,del_perm_check,ops,new_fn,set_fn,del_fn,rst_fn,
perm_p) values ('fn_attr','fn_attr','qw_fn_attrs','fn_id;attr',
'','','','new','','','','',
'0')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'attr','fn_attr','attr',
'Attribute','',
'Function attribute.','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'default','fn_attr','default_value',
'Default Value','',
'The attribute default value to use when a value is not provided for new and reset function types. If the default is null, use an unquoted null. If the default is a string value, use the quoted string, even for integer values.','',
'','100','varchar')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'fnid','fn_attr','fn_id',
'Function ID','',
'The function this attribute is for.','integer',
'','0','integer')"
db_dml insert_object_attr "insert into qw_attrs (attr_id,object_id,attr,
description,default_value,help_text,filters,values,length,datatype) values (
'order','fn_attr','attr_order',
'Attribute Order','',
'The order of the attribute in the function call. Only relative numbering is important.','integer',
'','0','integer')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','id',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','ops',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','permp',
'1;0','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','rstfn',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','delfn',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','setfn',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','delperms',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','setperms',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','key',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','eval',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','newfn',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','table',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_object','object',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','default',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','objectid',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','description',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','values',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','attr',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','help',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','id',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','length',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','datatype',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','filters',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','attr_order',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_attr','attr_table',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_group','id',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_group','name',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_group_attr_map','aid',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_group_attr_map','gid',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_group_attr_map','oid',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_group_attr_map','values',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_group_attr_map','ops',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','fn_types','type',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','fn_types','description',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','fn_types','name',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_fn','id',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_fn','type',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_fn','joiner',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_fn','active',
'0;1','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_fn','name',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_fn','description',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','qw_fn','oid',
'','new;set;del')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','fn_attr','default',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','fn_attr','fnid',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','fn_attr','attr',
'','new')"
db_dml  insert_qroup_attr_mapping "insert into qw_group_attr_map 
(group_id,object_id,attr_id,values,ops) values ('1','fn_attr','order',
'','new')"

