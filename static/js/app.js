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
		}).
		when('/filter/:filter', {
			templateUrl: 'templates/filter.html',
			controller: 'filterController',
		}).
		when('/sites', {
			templateUrl: 'templates/sites.html',
			controller: 'sitesController',
		}).
		when('/sites/:filter', {
			templateUrl: 'templates/sites.html',
			controller: 'sitesController',
		});
}]);