var app = angular.module('dewy', [
	'ngRoute',
	'dewyControllers',
	'dewyFactories'
])

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
    $routeProvider.
    	when('/filter', {
			templateUrl: 'templates/app.html',
			controller: 'appController',
			page: 'filter'
		}).
		when('/filter/:filter', {
			templateUrl: 'templates/app.html',
			controller: 'appController',
			page: 'filter'
		}).
		when('/signon', {
			templateUrl: 'templates/signon.html',
			controller: 'signonController'
		}).
		when('/sites', {
			templateUrl: 'templates/app.html',
			controller: 'appController',
			page: 'sites'
		}).
		when('/sites/:filter', {
			templateUrl: 'templates/app.html',
			controller: 'appController',
			page: 'sites'
		}).
		otherwise({
			redirectTo: '/signon'
		});
}]);