var app = angular.module('dewy', [
	'ngRoute',
	'ngAnimate',
	'ui.sortable',
	'angular-momentjs',
	'flash',
	'validation.match',
	'dewyControllers',
	'dewyFactories',
	'dewyServices',
	'dewyDirectives'
])

app.config(['$httpProvider', '$routeProvider', '$locationProvider', function($httpProvider, $routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$httpProvider.interceptors.push('authInterceptor');
    $routeProvider.
		when('/account', {
			templateUrl: 'templates/account.html',
			controller: 'accountController',
			menuItem: 'account',
			requiresAuthorization: true
		}).
		when('/content/:filter?', {
			templateUrl: 'templates/overview.html',
			controller: 'overviewController',
			menuItem: 'overview',
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
			menuItem: 'manage',
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
			menuItem: 'overview',
			requiresAuthorization: true,
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				data: ['$route', 'filterFactory', 'moduleFactory', function($route, filterFactory, moduleFactory) {
					if ($route.current.params.filter) {
						return filterFactory.getFilter($route.current.params.filter).
						then(function(currentFilter) {
							return moduleFactory.getAll(currentFilter.fid).
							then(function(modules) {
								return {
									currentFilter: currentFilter,
									modules: modules,
									view: 'modules'
								}
							});
						});
					}
					else {
						return moduleFactory.getAll().
						then(function(modules) {
							return {
								currentFilter: null,
								modules: modules,
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
			menuItem: 'overview',
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
		when('/users/:filter?', {
			templateUrl: 'templates/overview.html',
			controller: 'overviewController',
			menuItem: 'overview',
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
		when('/verify/:uid/:verify', {
			templateUrl: 'templates/verify.html',
			controller: 'verifyController',
			requiresAuthorization: false,
			indexPage: true,
			resolve: {
				verifyData: ['$route', '$http', 'flash', 'authService', function($route, $http, flash, authService) {
					return $http.get('http://dewy.io/auth/verify/' + $route.current.params.uid + '/' + $route.current.params.verify).
					then(function(result) {
						flash('Email verified');
						authService.signOn(result.data);
					}, function(error) {
						if (error.status == '400') {
							return {error: error.data};
						} else {
							return {error: 'Dewy could not verify you at this time.'};
						}
					});
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
		})
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
				$rootScope.queuedIndexPage = next.indexPage;
				$rootScope.queuedMenuItem = next.menuItem;
			}
			$rootScope.isViewLoading = true;
		}
		else {
			if (authService.isAuthenticated()) {
				event.preventDefault();
				$location.path('/sites');
			} else {
				$rootScope.currentUser = null;
				$rootScope.queuedIndexPage = next.indexPage;
				$rootScope.queuedMenuItem = next.menuItem;
			}
		}
	});
	$rootScope.$on('$routeChangeSuccess', function() {
		$rootScope.isViewLoading = false;
		$rootScope.indexPage = $rootScope.queuedIndexPage;
		$rootScope.menuItem = $rootScope.queuedMenuItem;
	});
	$rootScope.$on('$routeChangeError', function() {
		$rootScope.isViewLoading = false;
		$rootScope.indexPage = $rootScope.queuedIndexPage;
		$rootScope.menuItem = $rootScope.queuedMenuItem;
	});
}]);