import os, json
from subprocess import Popen, PIPE

class Site:

	def __init__(self, root, directory, uri):
		self.root = root
		self.directory = directory
		self.uris = [uri]

		os.chdir(directory)

		# Pull what we can from drush 
		process = Popen(["drush", "--format=json", "--root=" + self.root, "--uri=" + self.uris[0], "status"], stdout=PIPE, stderr=PIPE)
		out, err = process.communicate()
		sitedetails = json.loads(out)
		sitedetails['filecount'] = 0
		sitedetails['filesize'] = 0
		sitedetails['privatefilecount'] = 0
		sitedetails['privatefilesize'] = 0

		# Get files
		for dir, subdir, files in os.walk(os.path.join(self.root, sitedetails['files'])):
			for file in files:
				sitedetails['filecount'] = sitedetails['filecount'] + 1
				sitedetails['filesize'] += os.path.getsize(os.path.join(self.root, sitedetails['files']))
		for dir, subdir, privatefiles in os.walk(os.path.join(self.root, sitedetails['private'])):
			for privatefile in privatefiles:
				sitedetails['privatefilecount'] = sitedetails['privatefilecount'] + 1
				sitedetails['privatefilesize'] += os.path.getsize(os.path.join(self.root, sitedetails['private']))

	def get_projects(self):
		# Get projects
		process = Popen(["drush", "--format=json", "--root=" + self.root, "--uri=" + self.uris[0], "pm-info"], stdout=PIPE, stderr=PIPE)
		out, err = process.communicate()
		projects = json.loads(out)
		for project in projects:
			print projects[project]
