function(doc) {
	if (doc.site) {
		emit(doc.uri, doc);
	}
}