#!/usr/bin/env python

import os, yaml, couchdb
from dewey_site import Site

# Grab configuration
with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)
    file.close()

# Get all Drupal sites, projects
sites = dict()
projects = dict()
for uri in os.listdir(config['sites-root']):
	directory = os.path.realpath(os.path.join(config['sites-root'], uri))

	# Get sites
	if os.path.isdir(directory) and os.path.split(directory)[1] != 'all' and os.path.split(directory)[1] != 'default':
		# There may be multiple folders pointing at the same site, create a URI for each
		if directory in sites:
			sites[directory].details.uris.append(uri)
		else:
			sites[directory] = Site(config['drupal-root'], directory, uri)

		# Get list of projects, avoid duplicates
		site_projects = sites[directory].get_projects()
		for site_project in site_projects:
			if site_projects[site_project]['path'] not in projects:
				projects[site_projects[site_project]['path']] = site_projects[site_project]

# Pass to Couch
couch = couchdb.Server(config['couch-location'])
db = couch['dewey']
for directory, site in sites.items():
	db.save({directory: site.details})
for path, project in projects.items():
	db.save({path: project})