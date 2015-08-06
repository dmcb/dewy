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
		filedetails = talkToDrush(self, ['dewey-file-usage'])
		self.details['filecount'] = filedetails['filecount']['public']
		self.details['filesize'] = filedetails['filesize']['public']
		self.details['privatefilecount'] = filedetails['filecount']['private']
		self.details['privatefilesize'] = filedetails['filesize']['private']

		# Get user stats
		userdetails = talkToDrush(self, ['dewey-user-stats'])
		self.details['users'] = userdetails['users']
		self.details['lastaccess'] = userdetails['lastaccess']
		self.details['roles'] = userdetails['roles']

		# Get node stats
		nodedetails = talkToDrush(self, ['dewey-node-stats'])
		self.details['counted_words'] = nodedetails['counted_words']
		if nodedetails['lastmodified']:
			self.details['lastmodified'] = datetime.datetime.fromtimestamp(int(nodedetails['lastmodified'])).isoformat('T')
		else:
			self.details['lastmodified'] = None

		# Get projects
		projectdetails = talkToDrush(self, ['pm-info', '--format=json'])
		self.details['projects'] = []
		for project in projectdetails:
			projectdetails[project]['audited'] = self.details['audited']
			self.details['projects'].append([projectdetails[project]['path'], projectdetails[project]['status']])
		return projectdetails
