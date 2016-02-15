var app = angular.module('dewy', [
	'ngRoute',
	'ngAnimate',
	'ui.sortable',
	'dewyControllers',
	'dewyFactories',
	'dewyServices'
])

app.config(['$httpProvider', '$routeProvider', '$locationProvider', function($httpProvider, $routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$httpProvider.interceptors.push('authInterceptor');
    $routeProvider.
    	when('/filter', {
			templateUrl: 'templates/filter.html',
			controller: 'filterController',
			requiresAuthorization: true,
			resolve: {
				auth: ['authResolver', function(authResolver) {
					return authResolver.resolve(true);
				}],
				operators: ['filterFactory', function(filterFactory) {
					return filterFactory.getOperators();
				}],
				fields: ['filterFactory', function(filterFactory) {
					return filterFactory.getFields();
				}],
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				currentFilter: ['$route', 'filterFactory', function($route, filterFactory) {
					return filterFactory.getFilter($route.current.params.filter);
				}],
				tags: ['sitesFactory', function(sitesFactory) {
					return sitesFactory.getTags();
				}]
			}
		}).
		when('/filter/:filter', {
			templateUrl: 'templates/filter.html',
			controller: 'filterController',
			requiresAuthorization: true,
			resolve: {
				auth: ['authResolver', function(authResolver) {
					return authResolver.resolve(true);
				}],
				operators: ['filterFactory', function(filterFactory) {
					return filterFactory.getOperators();
				}],
				fields: ['filterFactory', function(filterFactory) {
					return filterFactory.getFields();
				}],
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				currentFilter: ['$route', 'filterFactory', function($route, filterFactory) {
					return filterFactory.getFilter($route.current.params.filter);
				}],
				tags: ['sitesFactory', function(sitesFactory) {
					return sitesFactory.getTags();
				}]
			}
		}).
		when('/signon', {
			templateUrl: 'templates/signon.html',
			controller: 'signonController',
			requiresAuthorization: false,
			resolve: {
				auth: ['authResolver', function(authResolver) {
					return authResolver.resolve(false);
				}]
			}
		}).
		when('/sites', {
			templateUrl: 'templates/sites.html',
			controller: 'sitesController',
			requiresAuthorization: true,
			resolve: {
				auth: ['authResolver', function(authResolver) {
					return authResolver.resolve(true);
				}],
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				sitesAndFilter: ['sitesFactory', function(sitesFactory, currentFilter) {
					return sitesFactory.getAll().
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
			requiresAuthorization: true,
			resolve: {
				auth: ['authResolver', function(authResolver) {
					return authResolver.resolve(true);
				}],
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				sitesAndFilter: ['$route', 'filterFactory', 'sitesFactory', function($route, filterFactory, sitesFactory) {
					return filterFactory.getFilter($route.current.params.filter).
					then(function(currentFilter) {
						console.log(currentFilter);
						return sitesFactory.getAll(currentFilter.fid).
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
			requiresAuthorization: true,
			resolve: {
				auth: ['authResolver', function(authResolver) {
					return authResolver.resolve(true);
				}]
			}
		}).
		when('/', {
			templateUrl: 'templates/index.html',
			requiresAuthorization: false,
			resolve: {
				auth: ['authResolver', function(authResolver) {
					return authResolver.resolve(false);
				}]
			}
		}).
		otherwise({
			controller: function() {
				window.location.replace('/');
			},
			template : '<div></div>'
		});
}]);

app.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window) {
	$rootScope.$on('$routeChangeStart', function (event, next) {
		if (next.requiresAuthorization) {
			// if (!authService.isAuthenticated()) {
			if (!$window.localStorage.user && !$window.sessionStorage.user) {
				event.preventDefault();
				$location.path('/signon');
			}
		}
		else {
			// if (authService.isAuthenticated()) {
			if ($window.localStorage.user || $window.sessionStorage.user) {
				event.preventDefault();
				$location.path('/sites');
			}
		}
	});
}]);