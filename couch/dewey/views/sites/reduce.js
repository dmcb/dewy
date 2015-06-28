function(key, values, rereduce) {
	var latest_update = new Object();
	latest_update["audited"] = "0000-00-00T00:00:00"
	for (index in values) {
		var update = values[index]
		if (update["audited"] > latest_update["audited"]) {
			latest_update = update;
		}
	}
	return latest_update;
}