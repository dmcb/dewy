<?php

function dewey_drush_command() {

	$items['dewey-uniqueness'] = array(
		'aliases' => array('dyuq'),
		'callback' => 'drush_dewey_uniqueness',
		'description' => dt('Show unique identifiers of a site.'),
		'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_CONFIGURATION,
	);

	$items['dewey-file-usage'] = array(
		'aliases' => array('dyfu'),
		'callback' => 'drush_dewey_file_usage',
		'description' => dt('Gather stats on a site\'s file usage.'),
		'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_DATABASE,
	);

	$items['dewey-user-stats'] = array(
		'aliases' => array('dyus'),
		'callback' => 'drush_dewey_user_stats',
		'description' => dt('List users, roles and last access.'),
		'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_DATABASE,
	);

	$items['dewey-node-stats'] = array(
		'aliases' => array('dyns'),
		'callback' => 'drush_dewey_node_stats',
		'description' => dt('Count word occurences, nodes and last modification.'),
		'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_DATABASE,
	);

	return $items;
}

function drush_dewey_uniqueness() {
	$output['uri'] = _drush_bootstrap_selected_uri();

	global $databases;
	$output['database_host'] = $databases['default']['default']['host'].":".$databases['default']['default']['port'];
	$output['database'] = $databases['default']['default']['database'];

	drush_print(json_encode($output));
}

function drush_dewey_file_usage() {
	$types = array('public', 'private');

	$path['public'] = variable_get('file_public_path', conf_path() . '/files');
	$path['private'] = variable_get('file_private_path');

	foreach($types as $type) {
		$output['filecount'][$type] = 0;
		$output['filesize'][$type] = 0;

		if (is_dir($path[$type])) {
			$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path[$type], RecursiveDirectoryIterator::SKIP_DOTS), RecursiveIteratorIterator::SELF_FIRST);
			$filelist = array();
			foreach($iterator as $file) {
				if (!$file->isDir()) {
					$output['filecount'][$type]++;
					$output['filesize'][$type] += $file->getSize();
				}
			}
		}
	}

	drush_print(json_encode($output));
}

function drush_dewey_user_stats() {
	$output['users'] = array();
	$output['roles'] = array();
	$output['lastaccess'] = 0;

	$result = db_query("SELECT users.name AS name, mail, access, status, role.name AS role FROM users, role, users_roles WHERE users.uid = users_roles.uid AND users_roles.rid = role.rid");
	while ($user = $result->fetchAssoc()) {
		$output['users'][$user['name']] = $user;
		if ($user['access'] > $output['lastaccess']) {
			$output['lastaccess'] = $user['access'];
		}
		if (isset($output['roles'][$user['role']])) {
			$output['roles'][$user['role']]++;
		} else {
			$output['roles'][$user['role']] = 1;
		}
	}

	$output['usercount'] = sizeof($output['users']);
	$output['rolecount'] = sizeof($output['roles']);

	drush_print(json_encode($output));
}

function drush_dewey_node_stats() {
	include 'dewey/html2text.php';
	$result = db_query("SELECT body_value FROM field_data_body");
	$output['counted_words'] = array();
	while ($body = $result->fetchAssoc()) {
		$body = strtolower(convert_html_to_text($body['body_value']));
		$words = preg_split("/[\s,]+/", $body);
		$output['counted_words'] = array_count_values($words);
	}

	$result = db_query("SELECT changed FROM node ORDER BY changed DESC LIMIT 1");
	$changed = $result->fetchAssoc();
	$output['lastmodified'] = $changed['changed'];
	
	drush_print(json_encode($output));
}