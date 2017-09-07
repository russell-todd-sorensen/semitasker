var getCustomer = function(id) {
	var customer = $('#' + id + ' option:selected').val();
	Log.Notice('customer=' + customer);
	var field,fieldValue
	for (var i = 0;i<customerFields.length;i++) {
		field = customerFields[i];
		if (field == '!CUST') continue;
		if (field == 'NAME') continue;
		fieldValue = customerData[customer]['field_' + field];
		if (dataArray['TYPE-' + field]) {
			Data.setSelect('field_' + field,fieldValue);
		} else {
			$('#field_' + field).val(fieldValue);
		}
	}
	Log.Notice('finished with customer ' + customer);
}