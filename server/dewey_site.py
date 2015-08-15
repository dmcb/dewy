import os, json, datetime
from subprocess import Popen, PIPE

def talkToDrush(self, commands=[]):
	if self.alias:
		arguments = ['drush', '-y', self.alias]
		# process = Popen(['drush', '-y', '@' + self.alias, commands], stdout=PIPE, stderr=PIPE)
	else:
		arguments = ['drush', '--root=' + self.root, '--uri=' + self.uri]
		# process = Popen(['drush', '--root=' + self.root, '--uri=' + self.uri, commands], stdout=PIPE, stderr=PIPE)
	try:
		process = Popen(arguments + commands, stdout=PIPE, stderr=PIPE)
		out, err = process.communicate()
		return json.loads(out)
	except:
		if self.alias:
			print "Drush failed to communicate to " + self.alias
		else:
			print "Drush failed to communicate to " + self.uri
		raise Exception

class Site:

	def __init__(self, root=None, uri=None, alias=None):
		# Define basics
		self.root = root
		self.uri = uri
		self.alias = alias
		self.details = dict()

		# Get unique identifier
		try:
			output = talkToDrush(self,['dewey-uniqueness'])
			self.unique_identifier = output['database_host'] + '/' + output['database']
			self.details['uris'] = [output['uri']]
			print "Added " + output['uri']
		except:
			if self.alias:
				print "Failed to identify " + self.alias
			else:
				print "Failed to identify " + self.uri
			raise Exception

	def auditSite(self):
		# Message
		print('Processing ' + self.details['uris'][0])
		self.details['audited'] = datetime.datetime.now().isoformat('T')

		# Get file stats
		filedetails = talkToDrush(self, ['dewey-file-stats'])
		self.details['filecount'] = filedetails['filecount']['public']
		self.details['filesize'] = filedetails['filesize']['public']
		self.details['privatefilecount'] = filedetails['filecount']['private']
		self.details['privatefilesize'] = filedetails['filesize']['private']

		# Get user stats
		userdetails = talkToDrush(self, ['dewey-user-stats'])
		self.details['users'] = userdetails['users']
		self.details['usercount'] = userdetails['usercount']
		self.details['lastaccess'] = userdetails['lastaccess']
		self.details['roles'] = userdetails['roles']
		self.details['rolecount'] = userdetails['rolecount']

		# Get content stats
		contentdetails = talkToDrush(self, ['dewey-content-stats'])
		self.details['content_types'] = contentdetails['content_types']
		self.details['counted_words'] = contentdetails['counted_words']
		if contentdetails['lastmodified']:
			self.details['lastmodified'] = datetime.datetime.fromtimestamp(int(contentdetails['lastmodified'])).isoformat('T')
		else:
			self.details['lastmodified'] = None

		# Get projects
		projectdetails = talkToDrush(self, ['pm-info', '--format=json'])
		self.details['modules'] = dict()
		self.details['enabledmodulecount'] = 0
		self.details['totalmodulecount'] = 0
		for project in projectdetails:
			projectdetails[project]['audited'] = self.details['audited']
			if projectdetails[project]['type'] == 'module':
				self.details['totalmodulecount'] = self.details['totalmodulecount']+1
				self.details['modules'][projectdetails[project]['path']] = {'status': projectdetails[project]['status'], 'schema': projectdetails[project]['schema_version'], 'version': projectdetails[project]['version']}
				if projectdetails[project]['status'] == 'enabled' and projectdetails[project]['type'] == 'module':
					self.details['enabledmodulecount'] = self.details['enabledmodulecount']+1
					

		return projectdetails
