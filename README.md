# Dewey

A Drupal multi-site visualization tool

## Requirements

* Drush 6.x
* Python 2.6+
	* pyyaml
	* couchdb
* CouchDB 1.6+
* Couchapp 1.0+

## Configuration

1. On your Drupal app server, configure the Dewey daemon

		cp config.yml.default config.yml

2. On your couchdb server, deploy the couchapp into the database:
	
		cd dewey/couch/dewey
		couchapp push dewey