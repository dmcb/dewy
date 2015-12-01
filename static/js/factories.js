var factories = angular.module('dewyFactories', []);

factories.factory('filterFactory', ['$http', function($http) {
	var filterFactory = {};

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
					choice: 'are present',
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
