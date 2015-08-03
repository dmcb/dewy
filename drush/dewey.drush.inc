<?php

function dewey_drush_command() {
	$items['file-usage'] = array(
		'aliases' => array('fu'),
		'callback' => 'drush_file_usage',
		'description' => dt('Gather stats on a site\'s file usage.'),
		'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_DATABASE,
	);

	return $items;
}

function drush_file_usage() {
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