var app = angular.module('dewy', [
	'config',
	'ngRoute',
	'ngAnimate',
	'ui.sortable',
	'angular-momentjs',
	'stripe',
	'validation.match',
	'dewyControllers',
	'dewyFactories',
	'dewyServices',
	'dewyDirectives'
])

app.config(['$httpProvider', '$routeProvider', '$interpolateProvider', '$locationProvider', 'ENV', function($httpProvider, $routeProvider, $interpolateProvider, $locationProvider, ENV) {
	$locationProvider.html5Mode(true);
	$httpProvider.interceptors.push('authInterceptor');
	$interpolateProvider.startSymbol('{(').endSymbol(')}');
    Stripe.setPublishableKey(ENV.stripePublicKey);
    $routeProvider.
		when('/account', {
			templateUrl: 'templates/account.html',
			controller: 'accountController',
			title: 'Account',
			menuItem: 'account',
			appPage: true,
			requiresAuthorization: true
		}).
		// when('/content/:filter?', {
		// 	templateUrl: 'templates/overview.html',
		// 	controller: 'overviewController',
		// 	menuItem: 'overview',
		// 	requiresAuthorization: true,
		// 	resolve: {
		// 		filters: ['filterFactory', function(filterFactory) {
		// 			return filterFactory.getAll();
		// 		}],
		// 		filterIndex: ['filterFactory', function(filterFactory) {
		// 			return filterFactory.getIndex();
		// 		}],
		// 		data: ['$route', 'filterFactory', 'sitesFactory', function($route, filterFactory, sitesFactory) {
		// 			if ($route.current.params.filter) {
		// 				return filterFactory.getFilter($route.current.params.filter).
		// 				then(function(currentFilter) {
		// 					return sitesFactory.getAll(currentFilter.fid).
		// 					then(function(sites) {
		// 						return {
		// 							currentFilter: currentFilter,
		// 							sites: sites,
		// 							view: 'content'
		// 						}
		// 					});
		// 				});
		// 			}
		// 			else {
		// 				return sitesFactory.getAll().
		// 				then(function(sites) {
		// 					return {
		// 						currentFilter: null,
		// 						sites: sites,
		// 						view: 'content'
		// 					}
		// 				});
		// 			}
		// 		}]
		// 	}
		// }).
		when('/filter/:filter?', {
			templateUrl: 'templates/filter.html',
			controller: 'filterController',
			title: 'Filter',
			appPage: true,
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
		when('/filters', {
			templateUrl: 'templates/filters.html',
			controller: 'filtersController',
			title: 'Filters',
			menuItem: 'filters',
			appPage: true,
			requiresAuthorization: true,
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				filterIndex: ['filterFactory', function(filterFactory) {
					return filterFactory.getIndex();
				}]
			}
		}).
		when('/manage', {
			templateUrl: 'templates/manage.html',
			controller: 'manageController',
			menuItem: 'manage',
			title: 'Manage sites',
			appPage: true,
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
			title: 'Modules',
			menuItem: 'overview',
			appPage: true,
			requiresAuthorization: true,
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				filterIndex: ['filterFactory', function(filterFactory) {
					return filterFactory.getIndex();
				}],
				projects: ['projectFactory', function(projectFactory) {
					return null;
				}],
				data: ['$route', 'filterFactory', 'moduleFactory', function($route, filterFactory, moduleFactory) {
					if ($route.current.params.filter) {
						return filterFactory.getFilter($route.current.params.filter).
						then(function(currentFilter) {
							return moduleFactory.getAll(currentFilter.fid).
							then(function(moduleData) {
								return {
									currentFilter: currentFilter,
									moduleData: moduleData,
									view: 'modules'
								}
							});
						});
					}
					else {
						return moduleFactory.getAll().
						then(function(moduleData) {
							return {
								currentFilter: null,
								moduleData: moduleData,
								view: 'modules'
							}
						});
					}
				}]
			}
		}).
		when('/reset', {
			templateUrl: 'templates/reset.html',
			controller: 'signonController',
			title: 'Reset password',
			requiresAuthorization: false,
		}).
		when('/reset/:uid/:reset', {
			templateUrl: 'templates/reset_response.html',
			controller: 'resetController',
			title: 'Reset password',
			resolve: {
				resetData: ['$rootScope', '$route', 'userFactory', function($rootScope, $route, userFactory) {
					return userFactory.resetPassword($route.current.params.uid, $route.current.params.reset)
					.then(function(result) {
						return {message: 'Your password has been reset, you will receive a new password shortly.'}
					}, function(error) {
						if (error.status == '400') {
							return {error: error.data};
						} else {
							return {error: 'Dewy could not reset your password at this time.'};
						}
					});
				}]
			}
		}).
		when('/signon', {
			templateUrl: 'templates/signon.html',
			controller: 'signonController',
			title: 'Sign on',
			requiresAuthorization: false,
		}).
		when('/signup', {
			templateUrl: 'templates/signup.html',
			controller: 'signupController',
			title: 'Sign up',
			requiresAuthorization: false,
		}).
		when('/sites/:filter?', {
			templateUrl: 'templates/overview.html',
			controller: 'overviewController',
			title: 'Sites',
			menuItem: 'overview',
			appPage: true,
			requiresAuthorization: true,
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				filterIndex: ['filterFactory', function(filterFactory) {
					return filterFactory.getIndex();
				}],
				projects: ['projectFactory', function(projectFactory) {
					return projectFactory.getAll();
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
		when('/subscription', {
			templateUrl: 'templates/subscription.html',
			controller: 'subscriptionController',
			title: 'Subscription',
			menuItem: 'subscription',
			appPage: true,
			requiresAuthorization: true,
			resolve: {
				customer: ['authService', 'userFactory', function(authService, userFactory) {
					return userFactory.getCustomer(authService.currentUser().uid)
					.then(function(result) {
						return result;
					}, function(error) {
						if (error.status == '400') {
							return;
						} else {
							return {error: 'Your customer information could not be retrieved at this time.'};
						}
					});
				}]
			}
		}).
		// when('/users/:filter?', {
		// 	templateUrl: 'templates/overview.html',
		// 	controller: 'overviewController',
		// 	menuItem: 'overview',
		// 	requiresAuthorization: true,
		// 	resolve: {
		// 		filters: ['filterFactory', function(filterFactory) {
		// 			return filterFactory.getAll();
		// 		}],
		// 		filterIndex: ['filterFactory', function(filterFactory) {
		// 			return filterFactory.getIndex();
		// 		}],
		// 		data: ['$route', 'filterFactory', 'sitesFactory', function($route, filterFactory, sitesFactory) {
		// 			if ($route.current.params.filter) {
		// 				return filterFactory.getFilter($route.current.params.filter).
		// 				then(function(currentFilter) {
		// 					return sitesFactory.getAll(currentFilter.fid).
		// 					then(function(sites) {
		// 						return {
		// 							currentFilter: currentFilter,
		// 							sites: sites,
		// 							view: 'users'
		// 						}
		// 					});
		// 				});
		// 			}
		// 			else {
		// 				return sitesFactory.getAll().
		// 				then(function(sites) {
		// 					return {
		// 						currentFilter: null,
		// 						sites: sites,
		// 						view: 'users'
		// 					}
		// 				});
		// 			}
		// 		}]
		// 	}
		// }).
		when('/verify/:uid/:verify', {
			templateUrl: 'templates/verify.html',
			controller: 'verifyController',
			title: 'Email verification',
			resolve: {
				verifyData: ['$rootScope', '$route', 'authService', 'userFactory', function($rootScope, $route, authService, userFactory) {
					return userFactory.verify($route.current.params.uid, $route.current.params.verify)
					.then(function(result) {
						$rootScope.$broadcast('flashMessage', {content: 'Email verified', type: 'message'});
						authService.signOn('/account', result.data);
						return {error: null};
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
			title: 'Take back Drupal',
			requiresAuthorization: false,
		}).
		otherwise({
			controller: ['$location', function($location) {
				$location.path('/');
			}],
			template : '<div></div>'
		})
}]);

app.run(['authService', '$rootScope', '$location', '$http', '$window', 'ENV', function(authService, $rootScope, $location, $http, $window, ENV) {
	$rootScope.env = ENV.environment;
	$rootScope.location = $location;
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
		$rootScope.isViewLoading = true;
		if (next.requiresAuthorization) {
			if (!authService.isAuthenticated()) {
				event.preventDefault();
				$location.path('/signon');
			} else {
				var currentUser = authService.currentUser();
				if (!currentUser) {
					$http.get(ENV.api + 'users')
					.success(function(result) {
						authService.setUser(result);
					});
				}
			}
		}
		else if ('requiresAuthorization' in next && !next.requiresAuthorization) {
			if (authService.isAuthenticated()) {
				event.preventDefault();
				if (current && current.controller == "overviewController") {
					$rootScope.isViewLoading = false;
				} else {
					$location.path('/sites');
				}
			}
		}
	});
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		$rootScope.isViewLoading = false;
		$rootScope.appPage = current.appPage;
		$rootScope.menuItem = current.menuItem;
		document.title = 'Dewy | ' + current.title;
	});
	$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
		if (rejection.status != 401) {
			if (previous) {
				$window.history.back();
			}
			else {
				$location.path('/').replace();
			}
			$rootScope.isViewLoading = false;
			if (rejection.status == 402) {
				$rootScope.$broadcast('flashMessage', {content: 'Please upgrade your subscription to use that feature', type: 'notice'});
			}
			else {
				$rootScope.$broadcast('flashMessage', {content: 'There is a problem communicating with Dewy at this time', type: 'error'});
			}
		}
	});
	$rootScope.$on('session:expired', function() {
		$rootScope.$broadcast('flashMessage', {content: 'Your session has expired', type: 'notice'});
		authService.signOff(true);
	});
	$rootScope.$on('signOff:success', function() {
		$location.path('/signon');
	});
	$rootScope.$on('signOn:success', function(event, data) {
		$location.path(data);
	});
}]);