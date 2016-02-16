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
			indexPage: true
		}).
		when('/sites', {
			templateUrl: 'templates/sites.html',
			controller: 'sitesController',
			requiresAuthorization: true,
			resolve: {
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
			requiresAuthorization: true
		}).
		when('/', {
			templateUrl: 'templates/index.html',
			requiresAuthorization: false,
			indexPage: true
		}).
		otherwise({
			controller: function() {
				window.location.replace('/');
			},
			template : '<div></div>'
		});
}]);

app.run(['authService', '$rootScope', '$location', '$http', '$window', function(authService, $rootScope, $location, $http, $window) {
	$rootScope.$on('$routeChangeStart', function (event, next) {
		if (next.requiresAuthorization) {
			if (!authService.isAuthenticated()) {
				event.preventDefault();
				$location.path('/signon');
			} else {
				$rootScope.currentUser = authService.currentUser();
				if (!$rootScope.currentUser) {
					$http.get('http://dewy.io/api/users')
					.success(function(result) {
						authService.setUser(result);
						$rootScope.currentUser = result;
					})
				}
				$rootScope.indexPage = next.indexPage;
			}
		}
		else {
			if (authService.isAuthenticated()) {
				event.preventDefault();
				$location.path('/sites');
			} else {
				$rootScope.currentUser = null;
				$rootScope.indexPage = next.indexPage;
			}
		}
	});
}]);