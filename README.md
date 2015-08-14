# Dewey

A Drupal multi-site visualization tool

## Requirements

* Drush 7.x
* Python 2.6+
	* pyyaml
	* couchdb
* CouchDB 1.6+
* Couchapp 1.0+

## Installation

### Drush server

1. Install Composer

	```
	curl -sS https://getcomposer.org/installer | php
	mv composer.phar /usr/local/bin/compose
	```


2. Install Drush

	```
	composer global require drush/drush:7.*
	```

### CouchDB server

1. CouchDB is rather difficult to install on most systems. You can try the [official instructions](http://docs.couchdb.org/en/latest/install/index.html), but better yet, [use Docker](https://registry.hub.docker.com/u/frodenas/couchdb/).

2. [Couchapp](https://github.com/couchapp/couchapp)

## Configuration

### Drush server

1. Configure the Dewey daemon by copying the default configuration file

	```
	cp dewey/config.yml.default dewey/config.yml
	```

2. In dewey/config.yml specify:

 	* **couch-location**: The location of the couch database to write data to The local Drupal install (if applicable)
 	* **drupal-root**: The location of the local Drupal environment (if applicable) to read sites from
 	* **alias-regex**: The regex to match any defined site aliases, for example, matching Pantheon sites would be **pantheon\..\***

3. Dewey uses Drush to gather information. Hook Drush up to specific Dewey commands by symlinking the Dewey commands to a location Drush can see. If you are using a remote platform and Drush aliases to gather site information, you will need to copy **drush/\*** to that platform (here are [Pantheon-specific instructions](https://pantheon.io/blog/expand-use-drush-pantheon-more-commands?mkt_tok=3RkMMJWWfF9wsRoju63PZKXonjHpfsX57O0sUaO3lMI%2F0ER3fOvrPUfGjI4FRcVmI%2BSLDwEYGJlv6SgFSbHDMadzzLgNUxg%3D), make sure to [enable Drush 7](https://pantheon.io/blog/fix-drush-site-aliases-policy-file))

	```
	mkdir ~/.drush
	ln -s drush/dewey.drush.inc ~/.drush/
	ln -s drush/dewey ~/.drush/
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