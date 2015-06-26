#!/usr/bin/env python

import os, yaml
from dewey_site import Site

# Grab configuration
with open("config.yml", 'r') as file:
    config = yaml.safe_load(file)
    file.close()

# Get all Drupal site directories and define sites
site_directories = dict()

for uri in os.listdir(config["sites-root"]):
	directory = os.path.realpath(os.path.join(config["sites-root"], uri))

	if os.path.isdir(directory) and os.path.split(directory)[1] != "all" and os.path.split(directory)[1] != "default":
		if directory in site_directories:
			site_directories[directory].uris.append(uri)
		else:
			site_directories[directory] = Site(config["drupal-root"], directory, uri)

# Audit sites
for directory, site in sorted(site_directories.items()):
	site.get_projects()
