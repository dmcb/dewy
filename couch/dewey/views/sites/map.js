function(doc) {
	if (doc.uris) {
		emit([doc.uris[0]], {'site': doc.uris[0], 'enabledmodulecount': doc.enabledmodulecount, 'totalmodulecount': doc.totalmodulecount, 'usercount': doc.usercount, 'rolecount': doc.rolecount, 'filecount': doc.filecount, 'filesize': doc.filesize, 'privatefilecount': doc.privatefilecount, 'privatefilesize': doc.privatefilesize, 'lastaccess': doc.lastaccess, 'audited': doc.audited});
	}
}