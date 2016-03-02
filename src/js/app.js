var app = angular.module('dewy', [
	'ngRoute',
	'ngAnimate',
	'ui.sortable',
	'dewyControllers',
	'dewyFactories',
	'dewyServices',
	'dewyDirectives'
])

app.config(['$httpProvider', '$routeProvider', '$locationProvider', function($httpProvider, $routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$httpProvider.interceptors.push('authInterceptor');
    $routeProvider.
		when('/content/:filter?', {
			templateUrl: 'templates/overview.html',
			controller: 'overviewController',
			requiresAuthorization: true,
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				data: ['$route', 'filterFactory', 'sitesFactory', function($route, filterFactory, sitesFactory) {
					if ($route.current.params.filter) {
						return filterFactory.getFilter($route.current.params.filter).
						then(function(currentFilter) {
							return sitesFactory.getAll(currentFilter.fid).
							then(function(sites) {
								return {
									currentFilter: currentFilter,
									sites: sites,
									view: 'content'
								}
							});
						});
					}
					else {
						return sitesFactory.getAll().
						then(function(sites) {
							return {
								currentFilter: null,
								sites: sites,
								view: 'content'
							}
						});
					}
				}]
			}
		}).
		when('/filter/:filter?', {
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
		when('/manage', {
			templateUrl: 'templates/manage.html',
			controller: 'manageController',
			requiresAuthorization: true,
			resolve: {
				sites: ['sitesFactory', function(sitesFactory) {
					return sitesFactory.getOffline();
				}],
				user: ['userFactory', function(userFactory) {
					return userFactory.get();
				}]
			}
		}).
		when('/modules/:filter?', {
			templateUrl: 'templates/overview.html',
			controller: 'overviewController',
			requiresAuthorization: true,
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				data: ['$route', 'filterFactory', 'sitesFactory', function($route, filterFactory, sitesFactory) {
					if ($route.current.params.filter) {
						return filterFactory.getFilter($route.current.params.filter).
						then(function(currentFilter) {
							return sitesFactory.getAll(currentFilter.fid).
							then(function(sites) {
								return {
									currentFilter: currentFilter,
									sites: sites,
									view: 'modules'
								}
							});
						});
					}
					else {
						return sitesFactory.getAll().
						then(function(sites) {
							return {
								currentFilter: null,
								sites: sites,
								view: 'modules'
							}
						});
					}
				}]
			}
		}).
		when('/signon', {
			templateUrl: 'templates/signon.html',
			controller: 'signonController',
			requiresAuthorization: false,
			indexPage: true
		}).
		when('/sites/:filter?', {
			templateUrl: 'templates/overview.html',
			controller: 'overviewController',
			requiresAuthorization: true,
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				data: ['$route', 'filterFactory', 'sitesFactory', function($route, filterFactory, sitesFactory) {
					if ($route.current.params.filter) {
						return filterFactory.getFilter($route.current.params.filter).
						then(function(currentFilter) {
							return sitesFactory.getAll(currentFilter.fid).
							then(function(sites) {
								return {
									currentFilter: currentFilter,
									sites: sites,
									view: 'sites'
								}
							});
						});
					}
					else {
						return sitesFactory.getAll().
						then(function(sites) {
							return {
								currentFilter: null,
								sites: sites,
								view: 'sites'
							}
						});
					}
				}]
			}
		}).
		when('/user', {
			templateUrl: 'templates/user.html',
			controller: 'userController',
			requiresAuthorization: true
		}).
		when('/users/:filter?', {
			templateUrl: 'templates/overview.html',
			controller: 'overviewController',
			requiresAuthorization: true,
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				data: ['$route', 'filterFactory', 'sitesFactory', function($route, filterFactory, sitesFactory) {
					if ($route.current.params.filter) {
						return filterFactory.getFilter($route.current.params.filter).
						then(function(currentFilter) {
							return sitesFactory.getAll(currentFilter.fid).
							then(function(sites) {
								return {
									currentFilter: currentFilter,
									sites: sites,
									view: 'users'
								}
							});
						});
					}
					else {
						return sitesFactory.getAll().
						then(function(sites) {
							return {
								currentFilter: null,
								sites: sites,
								view: 'users'
							}
						});
					}
				}]
			}
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