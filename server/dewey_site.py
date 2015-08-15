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
		self.details['file_count'] = filedetails['file_count']['public']
		self.details['file_size'] = filedetails['file_size']['public']
		self.details['private_file_count'] = filedetails['file_count']['private']
		self.details['private_file_size'] = filedetails['file_size']['private']

		# Get user stats
		userdetails = talkToDrush(self, ['dewey-user-stats'])
		self.details['users'] = userdetails['users']
		self.details['last_access'] = userdetails['last_access']
		self.details['roles'] = userdetails['roles']

		# Get content stats
		contentdetails = talkToDrush(self, ['dewey-content-stats'])
		self.details['content_types'] = contentdetails['content_types']
		self.details['words'] = contentdetails['words']
		if contentdetails['last_modified']:
			self.details['last_modified'] = datetime.datetime.fromtimestamp(int(contentdetails['last_modified'])).isoformat('T')
		else:
			self.details['last_modified'] = None

		# Get projects
		projectdetails = talkToDrush(self, ['pm-info', '--format=json'])
		self.details['modules'] = dict()
		for project in projectdetails:
			projectdetails[project]['audited'] = self.details['audited']
			if projectdetails[project]['type'] == 'module':
				self.details['modules'][projectdetails[project]['path']] = {'status': projectdetails[project]['status'], 'schema': projectdetails[project]['schema_version'], 'version': projectdetails[project]['version']}
					

		return projectdetails
