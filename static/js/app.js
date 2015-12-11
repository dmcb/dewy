var app = angular.module('dewy', [
	'ngRoute',
	'ngAnimate',
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
				}]
			}
		}).
		when('/sites', {
			templateUrl: 'templates/sites.html',
			controller: 'sitesController',
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll(null);
				}],
				currentFilter: function() {
					return null;
				},
				sites: ['sitesFactory', function(sitesFactory, currentFilter) {
					return sitesFactory.getAll(null, currentFilter);
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
				currentFilter: ['$route', 'filterFactory', function($route, filterFactory) {
					return filterFactory.getFilter($route.current.params.filter);
				}],
				sites: ['sitesFactory', function(sitesFactory, currentFilter) {
					return sitesFactory.getAll(null, currentFilter);
				}]
			}
		}).
		otherwise({
			controller: function() {
				window.location.replace('/signon');
			},
			template : '<div></div>'
		});
}]);