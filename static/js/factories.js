var factories = angular.module('dewyFactories', []);

factories.factory('authInterceptor', ['authService', '$location', '$q', '$injector', '$window', function(authService, $location, $q, $injector, $window) {
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
		// No longer authorized
		if (responseError.status == 401) {
			// But if proxy API sent back new access token
			if (responseError.data) {
				var $http = $injector.get('$http');
				var deferred = $q.defer();
				authService.update(responseError.data);
                return $http(responseError.config);
			}
			else {
				console.log('Access denied');
				authService.signOff();
			}
		}
		return $q.reject(responseError);
	}

	return authInterceptor;
}]);

factories.factory('authService', ['dewySession', '$rootScope', function(dewySession, $rootScope) {
	var authService = {};

	authService.currentUser = function() {
		return dewySession.getUser();
	}

	authService.isAuthenticated = function() {
		return !!dewySession.getToken();
	}

	authService.setUser = function(userDoc) {
		dewySession.setUser(userDoc);
		$rootScope.$broadcast('currentUser:updated', userDoc);
	}

	authService.signOff = function() {
		dewySession.destroy();
		$rootScope.$broadcast('signOff:success');
	}

	authService.signOn = function(location, payload, remember) {
		dewySession.create(payload, remember);
		$rootScope.$broadcast('signOn:success', location);
	};

	authService.update = function(payload) {
		dewySession.update(payload);
	}

	return authService;
}]);

factories.factory('filterFactory', ['$http', function($http) {
	var filterFactory = {};
	var apiUrl = "http://dewy.io/api";

	filterFactory.create = function(filterDoc) {
		return $http.post(apiUrl + '/filters', filterDoc)
			.then(function (response) {
				return response;
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

	filterFactory.getIndex = function() {
		return $http.get(apiUrl + '/filters/_index')
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
				return response;
			});
	}

	filterFactory.updateIndex = function(filterIndex) {
		return $http.post(apiUrl + '/filters/_index', filterIndex)
			.then(function (response) {
				return response;
			});
	}

	return filterFactory;
}]);

factories.factory('moduleFactory', ['$http', function($http) {
	var moduleFactory = {};
	var apiUrl = "http://dewy.io/api";

	moduleFactory.getAll = function(fid) {
		return $http.get(apiUrl + '/modules/_filter/' + fid)
			.then(function (response) {

				// Calculate values
				for (var i in response.data) {
					response.data[i].installRate = Math.round(response.data[i].totalInstalls / response.data[i].total * 100);
					response.data[i].totalVersions = 0;
					for (var j in response.data[i].versions) {
						response.data[i].totalVersions = response.data[i].totalVersions + 1;
					}
				}

				return response.data;
			});
	}

	return moduleFactory;
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

	userFactory.changeAccount = function(uid, existingPassword, newEmail, newPassword) {
		var update = {
			existingPassword: existingPassword,
			email: newEmail,
			password: newPassword
		}
		return $http.put(apiUrl + '/users/' + uid, update);
	}

	userFactory.checkAccount = function(uid, post) {
		post.check = true;
		return $http.put(apiUrl + '/users/' + uid, post);
	}

	userFactory.changeProfile = function(uid, username) {
		var update = {
			username: username
		}
		return $http.put(apiUrl + '/users/' + uid, update);
	}

	userFactory.resetKey = function(uid) {
		var update = {
			key: true
		}
		return $http.put(apiUrl + '/users/' + uid, update)
			.then(function (response) {
				return response.data;
			});
	}

	userFactory.reverify = function(uid) {
		return $http.get(apiUrl + '/users/_verify/' + uid)
			.then(function (response) {
				return response.data;
			});
	}

	return userFactory;
}]);