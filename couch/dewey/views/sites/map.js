function(doc) {
	if (doc.site) {
		enabledmodulecount = 0;
		for (i=0; i<doc.projects.length; i++) {
			if (doc.projects[i][1] == 'enabled') {
				enabledmodulecount++;
			}
		}
		emit([doc.uri], {'enabledmodulecount': enabledmodulecount, 'totalmodulecount': doc.projects.length, 'usercount': doc.users.length, 'rolecount': doc.roles.length,  'lastaccess': doc.lastaccess, 'audited': doc.audited});
	}
}