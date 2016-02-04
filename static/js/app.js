var app = angular.module('dewy', [
	'ngRoute',
	'ngAnimate',
	'ui.sortable',
	'dewyControllers',
	'dewyFactories',
	'dewyServices'
])

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
    $routeProvider.
    	when('/filter', {
			templateUrl: 'templates/filter.html',
			controller: 'filterController',
			resolve: {
				operators: ['filterFactory', function(filterFactory) {
					return filterFactory.getOperators();
				}],
				fields: ['filterFactory', function(filterFactory) {
					return filterFactory.getFields();
				}],
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll(null);
				}],
				currentFilter: ['$route', 'filterFactory', function($route, filterFactory) {
					return filterFactory.getFilter($route.current.params.filter);
				}],
				tags: ['tagFactory', function(tagFactory) {
					return tagFactory.getAll(null);
				}]
			}
		}).
		when('/filter/:filter', {
			templateUrl: 'templates/filter.html',
			controller: 'filterController',
			resolve: {
				operators: ['filterFactory', function(filterFactory) {
					return filterFactory.getOperators();
				}],
				fields: ['filterFactory', function(filterFactory) {
					return filterFactory.getFields();
				}],
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll(null);
				}],
				currentFilter: ['$route', 'filterFactory', function($route, filterFactory) {
					return filterFactory.getFilter($route.current.params.filter);
				}],
				tags: ['tagFactory', function(tagFactory) {
					return tagFactory.getAll(null);
				}]
			}
		}).
		when('/signon', {
			templateUrl: 'templates/signon.html',
			controller: 'signonController',
		}).
		when('/sites', {
			templateUrl: 'templates/sites.html',
			controller: 'sitesController',
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll(null);
				}],
				sitesAndFilter: ['sitesFactory', function(sitesFactory, currentFilter) {
					return sitesFactory.getAll(null, null).
					then(function(sites) {
						return {
							currentFilter: null,
							sites: sites
						}
					});
				}]
			}
		}).
		when('/sites/:filter', {
			templateUrl: 'templates/sites.html',
			controller: 'sitesController',
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll(null);
				}],
				sitesAndFilter: ['$route', 'filterFactory', 'sitesFactory', function($route, filterFactory, sitesFactory) {
					return filterFactory.getFilter($route.current.params.filter).
					then(function(currentFilter) {
						return sitesFactory.getAll(null, currentFilter.id).
						then(function(sites) {
							return {
								currentFilter: currentFilter,
								sites: sites,
							}
						});
					});
				}],
			}
		}).
		when('/user', {
			templateUrl: 'templates/user.html',
			controller: 'userController',
		}).
		when('/', {
			templateUrl: 'templates/index.html',
		}).
		otherwise({
			controller: function() {
				window.location.replace('/');
			},
			template : '<div></div>'
		});
}]);