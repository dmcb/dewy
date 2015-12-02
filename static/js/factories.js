var factories = angular.module('dewyFactories', []);

factories.factory('filterFactory', ['$http', function($http) {
	var filterFactory = {};
	var serviceUrl = "/api/filters";

	fields = [
		{
			title: 'Base URL',
			choices: [
				'contains',
				'does not contain',
				'is',
				'is not',
				'starts with',
				'ends with'
			],
			value: 'string'
		},
		{
			title: 'Content type',
			choices: [
				'contains',
				'does not contain',
				'is',
				'is not',
				'starts with',
				'ends with'
			],
			value: 'string'
		},
		{
			title: 'Database',
			choices: [
				'is pending updates',
				'is updated'
			],
			value: false
		},
		{
			title: 'Date added to Dewy',
			choices: [
				'is',
				'is not',
				'is after',
				'is before',
				'is in the last',
				'is not in the last'
			],
			value: 'date'
		},
		{
			title: 'Date last accessed',
			choices: [
				'is',
				'is not',
				'is after',
				'is before',
				'is in the last',
				'is not in the last'
			],
			value: 'date'
		},
		{
			title: 'Date last edited',
			choices: [
				'is',
				'is not',
				'is after',
				'is before',
				'is in the last',
				'is not in the last'
			],
			value: 'date'
		},
		{
			title: 'Drupal core',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: false
		},
		{
			title: 'File size (private)',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'number'
		},
		{
			title: 'File size (public)',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'File size (total)',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Maintenance mode',
			choices: [
				'is on',
				'is not on'
			],
			value: false
		},
		{
			title: 'Module name',
			choices: [
				'contains',
				'does not contain',
				'is',
				'is not',
				'starts with',
				'ends with'
			],
			value: 'string'
		},
		{
			title: 'Number of broken links',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of content types',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of files (private)',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of files (public)',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of files (total)',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of hits in past day',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of hits in past week',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of hits in past month',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of modules',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of nodes',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of roles',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of themes',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Number of users',
			choices: [
				'is',
				'is not',
				'is greater than',
				'is less than',
				'is greater than or equal to',
				'is less than or equal to'
			],
			value: 'integer'
		},
		{
			title: 'Role',
			choices: [
				'contains',
				'does not contain',
				'is',
				'is not',
				'starts with',
				'ends with'
			],
			value: 'string'
		},
		{
			title: 'Tag',
			choices: [
				'is',
				'is not'
			],
			value: 'string'
		},
		{
			title: 'Text',
			choices: [
				'contains',
				'does not contain',
				'is',
				'is not',
				'starts with',
				'ends with'
			],
			value: 'string'
		},
		{
			title: 'Theme',
			choices: [
				'contains',
				'does not contain',
				'is',
				'is not',
				'starts with',
				'ends with'
			],
			value: 'string'
		},
		{
			title: 'Title',
			choices: [
				'contains',
				'does not contain',
				'is',
				'is not',
				'starts with',
				'ends with'
			],
			value: 'string'
		},
		{
			title: 'User email address',
			choices: [
				'contains',
				'does not contain',
				'is',
				'is not',
				'starts with',
				'ends with'
			],
			value: 'string'
		},
		{
			title: 'User name',
			choices: [
				'contains',
				'does not contain',
				'is',
				'is not',
				'starts with',
				'ends with'
			],
			value: 'string'
		}
	]

	filters = [
		{
			title: 'In development',
			url: 'in-development',
			notifications: true,
			operator: 'any',
			rules: [
				{
					field: 'Maintenance mode',
					choice: 'is on'
				},
				{
					field: 'Tag',
					choice: 'is',
					value: 'development'
				}
			]
		},
		{
			title: 'Modules',
			children: [
				{
					title: 'Views',
					url: 'views',
					operator: 'all',
					rules: [
						{
							field: 'Module name',
							choice: 'is',
							value: 'views'
						},
						{
							field: 'Content type',
							choice: 'starts with',
							value: 'view_reference'
						}
					]
				},
				{
					title: 'Big webform sites',
					url: 'big-webform-sites',
					notifications: true,
					operator: 'all',
					rules: [
						{
							field: 'Module name',
							choice: 'contains',
							value: 'webform'
						},
						{
							operator: 'any',
							rules: [
								{
									field: 'Number of hits in past month',
									choice: 'is greater than',
									value: 7000
								},
								{
									field: 'Number of nodes',
									choice: 'is greater than',
									value: 5000
								}
							]
						}
					]
				}
			]
		},
		{
			title: 'Really long title to serve as an edge case for the design',
			url: 'really-long-title-to-serve-as-an-edge-case-for-the-design',
			notifications: true
		},
		{
			title: 'Anotherreallylongtitlewithoutbreaksthanksjerk',
			url: 'anotherreallylongtitlewithoutbreaksthanksjerk',
		}
	]

	filterFactory.delete = function(filter) {

	}

	filterFactory.getFields = function() {
		return fields;
	}

	filterFactory.getFilter = function(filters, url) {
		for (var i=0; i<filters.length; i++) {
			if (filters[i].url && filters[i].url == url) {
				return filters[i];
			}
			else if (filters[i].children) {
				// Comb through children recursively until a match is made
				result = this.getFilter(filters[i].children, url);
				if (result) {
					return result;
				}
			}
		}
	}

	filterFactory.getByUser = function(user) {
  		return filters;
	}

	filterFactory.update = function(filter) {
		$http.post(serviceUrl, filter)
			.success(function (response) {
				console.log(response);
			});
	}

	return filterFactory;
}]);

factories.factory('sitesFactory', ['$http', function($http) {
	var sitesFactory = {};

	sites = [
		{
			title: 'Photography Blog',
			base_url: 'photographybyderek.ca/blog',
			complexity: 3.53,
			size: 10,
			activity: 4.42,
			health: 1
		},
		{
			title: 'Derek McBurney',
			base_url: 'derekmcburney.com',
			complexity: 1,
			size: 4.17,
			activity: 7.35,
			health: 6.4
		},
		{
			title: 'my world, my choice!',
			base_url: 'myworldmychoice.org',
			complexity: 1,
			size: 6.12,
			activity: 4.92,
			health: 4.55
		}
	];

	sitesFactory.getByFilter = function(user, filter) {
  		return sites;
	}

	return sitesFactory;
}]);
