var factories = angular.module('dewyFactories', []);

factories.factory('authInterceptor', ['authService', '$location', '$q', '$window', function(authService, $location, $q, $window) {
	var authInterceptor = {};

	authInterceptor.request = function(config) {
		// If there's a JWT in session, add it to all requests
		config.headers = config.headers || {};
		if ($window.localStorage.token) {
			config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
		} else if ($window.sessionStorage.token) {
			config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
		}
		return config;
	}

	authInterceptor.responseError = function(responseError) {
		// If no longer authorized, sign off
		if (responseError.status == 401) {
			console.log('Access denied');
			authService.signOff();
		}
		return $q.reject(responseError);
	}

	return authInterceptor;
}]);

factories.factory('authService', ['dewySession', '$location', '$rootScope', function(dewySession, $location, $rootScope) {
	var authService = {};

	authService.currentUser = function() {
		return dewySession.getUser();
	}

	authService.isAuthenticated = function() {
		return !!dewySession.getToken();
	}

	authService.setUser = function(user) {
		dewySession.setUser(user);
	}

	authService.signOff = function() {
		dewySession.destroy();
		$location.path('/signon');
	}

	authService.signOn = function(result, remember) {
		dewySession.create(result);
		$rootScope.$broadcast('auth-signon-success');
		$location.path('/sites');
	};

	return authService;
}]);

factories.factory('filterFactory', ['$http', function($http) {
	var filterFactory = {};
	var apiUrl = "http://dewy.io/api";

	filterFactory.create = function(filterDoc) {
		return $http.post(apiUrl + '/filters', filterDoc)
			.then(function (response) {
				console.log(response);
			});
	}

	filterFactory.delete = function(fid) {
		return $http.delete(apiUrl + '/filters/' + fid);
	}

	filterFactory.getAll = function() {
		return $http.get(apiUrl + '/filters')
			.then(function (response) {
				return response.data;
			});
	}

	filterFactory.getFields = function() {
		return $http.get(apiUrl + '/fields/values', {cache: true})
			.then(function (response) {
				return response.data;
			});
	}

	filterFactory.getFilter = function(fid) {
		return $http.get(apiUrl + '/filters/' + fid)
			.then(function (response) {
				// Count the number of rules
				var count = 0;
				function walk(target) {
					var rules = target.rules, i;
					if (rules) {
						i = rules.length;
						while (i--) {
							walk(rules[i])
						}
					} else {
						count++;
					}
				}
				walk(response.data);
				response.data.count = count;
				return response.data;
			});
	}

	filterFactory.getOperators = function() {
		return $http.get(apiUrl + '/fields/operators', {cache: true})
			.then(function (response) {
				return response.data;
			});
	}

	filterFactory.update = function(filterDoc) {
		return $http.put(apiUrl + '/filters/' + filterDoc.fid, filterDoc)
			.then(function (response) {
				console.log(response);
			});
	}

	return filterFactory;
}]);

factories.factory('sitesFactory', ['$http', function($http) {
	var sitesFactory = {};
	var apiUrl = "http://dewy.io/api";

	sitesFactory.audit = function(sid) {
		var update = {
			audit: true
		};
		return $http.put(apiUrl + '/sites/' + sid, update)
			.success(function (response) {
				return response.data;
			})
			.error(function (error, status) {
				return error;
			});
	}

	sitesFactory.delete = function(sid) {
		return $http.delete(apiUrl + '/sites/' + sid);
	}

	sitesFactory.get = function(sid, detail) {
		return $http.get(apiUrl + '/sites/' + sid)
			.then(function (response) {
				return response.data;
			});
	}

	sitesFactory.getAll = function(fid) {
		return $http.get(apiUrl + '/sites/_filter/' + fid)
			.then(function (response) {

				// Loop through all sites and determine absolute values of attributes
				var attributes = {'complexity': [], 'size': [], 'activity': [], 'health': []};

				for (var i in response.data) {

					for (var attribute in attributes) {
						if (attributes[attribute]['maximum'] == null) {
							attributes[attribute]['maximum'] = response.data[i].attributes[attribute];
						} else if (attributes[attribute]['maximum'] < response.data[i].attributes[attribute]) {
							attributes[attribute]['maximum'] = response.data[i].attributes[attribute];
						}
						if (attributes[attribute]['minimum'] == null) {
							attributes[attribute]['minimum'] = response.data[i].attributes[attribute];
						} else if (attributes[attribute]['minimum'] > response.data[i].attributes[attribute]) {
							attributes[attribute]['minimum'] = response.data[i].attributes[attribute];
						}
					}
				}

				// Determine how much value is in a dot from range of attribute values
				for (var attribute in attributes) {
					attributes[attribute]['increment'] = (attributes[attribute]['maximum'] - attributes[attribute]['minimum']) / 9;
				}

				// Set normalized values
				for (var i in response.data) {
					for (var attribute in attributes) {
						if (!attributes[attribute]['increment']) {
							response.data[i][attribute] = 1;
						} 
						else {
							response.data[i][attribute] = ((response.data[i].attributes[attribute] - attributes[attribute]['minimum']) / attributes[attribute]['increment']) + 1;
						}
					}
				}

				return response.data;
			});
	}

	sitesFactory.getOffline = function() {
		return $http.get(apiUrl + '/sites/_offline')
			.then(function (response) {
				return response.data;
			});
	}

	sitesFactory.getTags = function() {
		return $http.get(apiUrl + '/sites/_tags')
			.then(function (response) {
				var tags = [];
				for (var i in response.data) {
					tags.push(response.data[i].key[1]);
				}
				return tags;
			});
	}

	sitesFactory.setTags = function(site) {
		var update = {
			tags: site.tags
		};
		return $http.put(apiUrl + '/sites/' + site.sid, update)
			.then(function (response) {
				return response.data;
			});
	}

	return sitesFactory;
}]);

factories.factory('userFactory', ['$http', function($http) {
	var userFactory = {};
	var apiUrl = "http://dewy.io/api";

	userFactory.get = function() {
		return $http.get(apiUrl + '/users')
			.then(function (response) {
				return response.data;
			});
	}

	userFactory.resetKey = function(uid) {
		var update = {
			key: true
		}
		return $http.put(apiUrl + '/users/' + uid, update)
			.then(function (response) {
				return response.data.apikey;
			});
	}

	return userFactory;
}]);