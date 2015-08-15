#!/usr/bin/env python

import sys, os, yaml, re, couchdb
from subprocess import Popen, PIPE
from dewey_site import Site

def getConfig():
	# Grab configuration
	with open('config.yml', 'r') as file:
	    config = yaml.safe_load(file)
	    file.close()

	return config

def getSites(config):
	sites = dict()

	# Get all local sites
	sitesroot = os.path.join(config['drupal-root'], 'sites');
	if os.path.isdir(sitesroot):
		for uri in os.listdir(sitesroot):
			sitedirectory = os.path.realpath(os.path.join(sitesroot, uri))
			if os.path.isdir(sitedirectory) and os.path.split(sitedirectory)[1] != 'all':
				try:
					site = Site(root=config['drupal-root'], uri=uri)
					if site.unique_identifier in sites:
						print "Already added " + site.uri + " but with a different URI"
						sites[site.unique_identifier].details['uris'].append(site.uri)
					else:
						print "Added " + site.uri
						sites[site.unique_identifier] = site
				except:
					print "Skipping " + uri

	# Validate site alias matching regex
	pattern = False
	if config['alias-regex']:
		try:
			pattern = re.compile('@' + config['alias-regex'])
		except:
			print "Invalid regular expression " + config['alias-regex']
			sys.exit(1)

	# Get all site alias sites
	process = Popen(['drush', 'site-alias'], stdout=PIPE, stderr=PIPE)
	out, err = process.communicate()
	for line in out.splitlines(True):
		alias = line.strip()
		if pattern and pattern.match(alias) or not pattern:
			try:
				site = Site(alias=alias)
				if site.unique_identifier in sites:
					print "Already added " + site.uri + " but with a different URI"
					sites[site.unique_identifier].details['uris'].append(site.uri)
				else:
					print "Added " + site.uri
					sites[site.unique_identifier] = site
			except:
				print "Skipping " + alias

	print str(len(sites.keys())) + " sites found"
	return sites

def auditSites(sites=dict(), projects=dict()):
	for unique_identifier, site in sites.items():
		site_projects = site.auditSite()
		for site_project in site_projects:
			if site_projects[site_project]['path'] not in projects:
				projects[site_projects[site_project]['path']] = site_projects[site_project]

def saveResults(config):
	# Set up Couch
	try:
		couch = couchdb.Server(config['couch-location'])
		db = couch['dewey']

		# Record to Couch
		for directory, site in sites.items():
			db.save(site.details)
		# for path, project in projects.items():
		# 	db.save(project)
	except:
		print "Communication to CouchDB at " + config['couch-location'] + "/dewey failed"

# Main execution
config = getConfig()
sites = getSites(config)
projects = dict()
auditSites(sites=sites, projects=projects)
saveResults(config)