# Dewey

A Drupal multi-site visualization tool

## Requirements

* Drush 6.x
* Python 2.6+
	* pyyaml
	* couchdb
	* beautifulsoup4
* CouchDB 1.6+
* Couchapp 1.0+

## Installation

### CouchDB server

1. CouchDB is rather difficult to install on most systems. You can try the [official instructions](http://docs.couchdb.org/en/latest/install/index.html), but better yet, [use Docker](https://registry.hub.docker.com/u/frodenas/couchdb/).

2. [Couchapp](https://github.com/couchapp/couchapp)

## Configuration

### Drupal server

1. Configure the Dewey daemon by copying the default file and making edits

	```
	cp config.yml.default config.yml
	```

### CouchDB server

1. Configure the web app to use Couch by copying the default file and specifying **Backbone.couch_connector.config.base_url**:

	```
	cp couch/dewey/_attachments/js/app.js.default couch/dewey/_attachments/js/app.js
	```


2. Deploy the couchapp into the database:

	```
	cd dewey/couch/dewey
	couchapp push http://user:pass@localhost:5984/dewey
	```
	
3. You can now access the Dewey site at **http://localhost:5984/dewey/_design/dewey/index.html**, but better yet, set up NGINX or Apache as a proxy to remove that ugly address.