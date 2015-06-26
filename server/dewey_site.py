import os, json
from subprocess import Popen, PIPE

class Site:

	def __init__(self, root, directory, uri):

		os.chdir(directory)

		# Get status
		process = Popen(['drush', '--format=json', '--root=' + root, '--uri=' + uri, 'status'], stdout=PIPE, stderr=PIPE)
		out, err = process.communicate()
		self.details = json.loads(out)
		self.details['uris'] = [uri]

		# Get file stats
		self.details['filecount'] = 0
		self.details['filesize'] = 0
		self.details['privatefilecount'] = 0
		self.details['privatefilesize'] = 0
		for dir, subdir, files in os.walk(os.path.join(root, self.details['files'])):
			for file in files:
				self.details['filecount'] = self.details['filecount'] + 1
				self.details['filesize'] += os.path.getsize(os.path.join(root, self.details['files']))
		for dir, subdir, privatefiles in os.walk(os.path.join(root, self.details['private'])):
			for privatefile in privatefiles:
				self.details['privatefilecount'] = self.details['privatefilecount'] + 1
				self.details['privatefilesize'] += os.path.getsize(os.path.join(root, self.details['private']))

		# Get projects
		process = Popen(['drush', '--format=json', '--root=' + root, '--uri=' + uri, 'pm-info'], stdout=PIPE, stderr=PIPE)
		out, err = process.communicate()
		self.details['projects'] = json.loads(out)
