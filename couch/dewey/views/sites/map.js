function(doc) {
	if (doc.uris) {
		modules = 0;
		for (module in doc.modules) {
 			if (doc.modules[module]['status'] == 'enabled') {
				modules++;
			}
 		}

		content_types = 0;
		nodes = 0;
		for (content_type in doc.content_types) {
			content_types++;
			nodes += doc.content_types[content_type];
 		}

		roles = 0;
		for (user in doc.roles) {
			roles++;
 		}

		words = 0;
		for (word in doc.words) {
			words += doc.words[word];
 		}

		users = 0;
		for (user in doc.users) {
			users++;
 		}

		files = doc.file_count + doc.private_file_count;

		emit([doc.uris[0]], {'site': doc.uris[0], 'modules': modules, 'content_types': content_types, 'roles': roles, 'nodes': nodes, 'words': words, 'users': users, 'files': files, 'last_access': doc.last_access, 'last_modification': doc.last_modified, 'audited': doc.audited});
	}
}