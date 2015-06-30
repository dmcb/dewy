import os, json, datetime
from subprocess import Popen, PIPE

class Site:

	def __init__(self, root, directory, uri):

		self.root = root
		self.directory = directory
		os.chdir(self.directory)

		# Get status
		process = Popen(['drush', '--format=json', '--root=' + self.root, '--uri=' + uri, 'status'], stdout=PIPE, stderr=PIPE)
		out, err = process.communicate()
		self.details = json.loads(out)
		self.details['uris'] = [uri]
		self.details['audited'] = datetime.datetime.now().isoformat('T')

		# Get file stats
		self.details['filecount'] = 0
		self.details['filesize'] = 0
		self.details['privatefilecount'] = 0
		self.details['privatefilesize'] = 0
		for dir, subdir, files in os.walk(os.path.join(self.root, self.details['files'])):
			for file in files:
				self.details['filecount'] = self.details['filecount'] + 1
				self.details['filesize'] += os.path.getsize(os.path.join(self.root, self.details['files']))
		if 'private' in self.details:
			for dir, subdir, privatefiles in os.walk(os.path.join(self.root, self.details['private'])):
				for privatefile in privatefiles:
					self.details['privatefilecount'] = self.details['privatefilecount'] + 1
					self.details['privatefilesize'] += os.path.getsize(os.path.join(self.root, self.details['private']))

	def get_projects(self):

		self.details['projects'] = []
		os.chdir(self.directory)

		process = Popen(['drush', '--format=json', '--root=' + self.root, '--uri=' + self.details['uris'][0], 'pm-info'], stdout=PIPE, stderr=PIPE)
		out, err = process.communicate()
		projects = json.loads(out)
		for project in projects:
			projects[project]['audited'] = self.details['audited']
			self.details['projects'].append([projects[project]['path'], projects[project]['status']])
		return projects
