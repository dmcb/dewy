function(doc) {
	if (doc.uris) {
		enabledmodulecount = 0;
		for (i=0; i<doc.projects.length; i++) {
			if (doc.projects[i][1] == 'enabled') {
				enabledmodulecount++;
			}
		}
		emit([doc.uris[0]], {'site': doc.uris[0], 'enabledmodulecount': enabledmodulecount, 'totalmodulecount': doc.projects.length, 'usercount': doc.users.length, 'rolecount': Object.keys(doc.roles).length, 'filecount': doc.filecount, 'filesize': doc.filesize, 'privatefilecount': doc.privatefilecount, 'privatefilesize': doc.privatefilesize, 'lastaccess': doc.lastaccess, 'audited': doc.audited});
	}
}