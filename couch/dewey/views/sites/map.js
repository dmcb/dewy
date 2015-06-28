function(doc) {
	if (doc.site) {
		for (var i=0; i<doc.projects.length; i++) {
			if (doc.projects[i][1] == "enabled") {
				emit([doc.uri, doc.projects[i][0]], doc);
			}
		}
	}
}