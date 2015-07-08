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

1. On your Drupal app server, configure the Dewey daemon

	```
	cp config.yml.default config.yml
	```

2. On your CouchDB server, deploy the couchapp into the database:

	```
	cd dewey/couch/dewey
	couchapp push http://user:pass@localhost:5984/ dewey
	```