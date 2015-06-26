#!/usr/bin/env python

import os, yaml, couchdb
from dewey_site import Site

# Grab configuration
with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)
    file.close()

# Get all Drupal site directories and define sites
site_directories = dict()

for uri in os.listdir(config['sites-root']):
	directory = os.path.realpath(os.path.join(config['sites-root'], uri))

	if os.path.isdir(directory) and os.path.split(directory)[1] != 'all' and os.path.split(directory)[1] != 'default':
		# There may be multiple folders pointing at the same site, create a URI for each
		if directory in site_directories:
			site_directories[directory].details.uris.append(uri)
		else:
			site_directories[directory] = Site(config['drupal-root'], directory, uri)

# Pass to Couch
couch = couchdb.Server(config['couch-location'])
db = couch['dewey']
for directory, site in sorted(site_directories.items()):
	db.save({directory: site.details})