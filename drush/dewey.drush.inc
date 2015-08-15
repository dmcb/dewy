<?php

function dewey_drush_command() {

	$items['dewey-uniqueness'] = array(
		'aliases' => array('dyuq'),
		'callback' => 'drush_dewey_uniqueness',
		'description' => dt('Show unique identifiers of a site.'),
		'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_CONFIGURATION,
	);

	$items['dewey-file-stats'] = array(
		'aliases' => array('dyfs'),
		'callback' => 'drush_dewey_file_stats',
		'description' => dt('Gather stats on a site\'s file usage.'),
		'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_DATABASE,
	);

	$items['dewey-user-stats'] = array(
		'aliases' => array('dyus'),
		'callback' => 'drush_dewey_user_stats',
		'description' => dt('List users, roles and last access.'),
		'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_DATABASE,
	);

	$items['dewey-content-stats'] = array(
		'aliases' => array('dycs'),
		'callback' => 'drush_dewey_content_stats',
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

function drush_dewey_file_stats() {
	$types = array('public', 'private');

	$path['public'] = variable_get('file_public_path', conf_path() . '/files');
	$path['private'] = variable_get('file_private_path');

	foreach($types as $type) {
		$output['file_count'][$type] = 0;
		$output['file_size'][$type] = 0;

		if (is_dir($path[$type])) {
			$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path[$type], RecursiveDirectoryIterator::SKIP_DOTS), RecursiveIteratorIterator::SELF_FIRST);
			$filelist = array();
			foreach($iterator as $file) {
				if (!$file->isDir()) {
					$output['file_count'][$type]++;
					$output['file_size'][$type] += $file->getSize();
				}
			}
		}
	}

	drush_print(json_encode($output));
}

function drush_dewey_user_stats() {
	$output['users'] = array();
	$output['roles'] = array();
	$output['last_access'] = 0;

	$result = db_query("SELECT users.name AS name, mail, access, status, role.name AS role FROM users, role, users_roles WHERE users.uid = users_roles.uid AND users_roles.rid = role.rid");
	while ($user = $result->fetchAssoc()) {
		if (isset($output['users'][$user['name']] )) {
			$output['users'][$user['name']]['role'][] = $user['role'];
		} else {
			$output['users'][$user['name']] = $user;
			$output['users'][$user['name']]['role'] = array($user['role']);
			if ($user['access'] > $output['last_access']) {
				$output['last_access'] = $user['access'];
			}
		}

		if (isset($output['roles'][$user['role']])) {
			$output['roles'][$user['role']]++;
		} else {
			$output['roles'][$user['role']] = 1;
		}
	}

	drush_print(json_encode($output));
}

function drush_dewey_content_stats() {
	$output['content_types'] = array();

	$result = db_query("SELECT count(nid) as count, type FROM node");
	while ($content_type = $result->fetchAssoc()) {
		$output['content_types'][$content_type['type']] = intval($content_type['count']);
	}

	include 'dewey/html2text.php';
	$output['words'] = array();
	if (db_table_exists('field_data_body')) {
		$result = db_query("SELECT body_value FROM field_data_body");
		while ($body = $result->fetchAssoc()) {
			$body = strtolower(convert_html_to_text($body['body_value']));
			$words = preg_split("/[\s,]+/", $body);
			$output['words'] = array_count_values($words);
		}
	}

	$result = db_query("SELECT changed FROM node ORDER BY changed DESC LIMIT 1");
	$changed = $result->fetchAssoc();
	$output['last_modified'] = $changed['changed'];
	
	drush_print(json_encode($output));
}