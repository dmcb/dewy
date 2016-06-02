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

	moduleFactory.getDetails = function(moduleWithCore) {
		return $http.get(apiUrl + '/modules/' + moduleWithCore + '/_detail')
			.then(function (response) {
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

	sitesFactory.get = function(sid) {
		return $http.get(apiUrl + '/sites/' + sid)
			.then(function (response) {
				return response.data;
			});
	}

	sitesFactory.getDetails = function(sid) {
		return $http.get(apiUrl + '/sites/' + sid + '/_detail')
			.then(function (response) {
				return response.data;
			});
	}

	sitesFactory.getAll = function(fid) {
		return $http.get(apiUrl + '/sites/_filter/' + fid)
			.then(function (response) {

				var arrayOfRankings = [];
				for (var i in response.data) {
					var ranking = [];
					for (var j in response.data[i].attributes) {
						ranking.push(response.data[i].attributes[j]);
					}
					arrayOfRankings.push(ranking);
				}

				var length = arrayOfRankings[0].length,
				    rankedArray = Array.apply(null, { length: arrayOfRankings.length }).map(function () { return []; }),
				    temp, i;

				for (i = 0; i < length; i++) {
				    temp = [];
				    arrayOfRankings.forEach(function (a, j) {
				        temp.push({ v: a[i], i: j });
				    });
				    var mostRecentValue;
				    var mostRecentIndex = 0;
				    temp.sort(function (a, b) {
				        return a.v - b.v;
				    })

				    // Get minimum and maximum value for attribute
				    var minimum = temp[0].v;
				    var maximum = temp[temp.length-1].v;
				    var increment = maximum - minimum / 9;

				    temp.forEach(function (a, j) {
				    	if (!increment) {
							rankedArray[a.i][i] = 1;
						}
						else {
							rankedArray[a.i][i] = Math.log((temp[j].v - minimum / increment) + 1);
						}
				    });
				}

				// 0 availableModules
				// 1 enabledModules
				// 2 contentTypes
				// 3 roles
				// 4 users
				// 5 nodes
				// 6 files
				// 7 words
				// 8 diskSpace
				// 9 lastModified
				// 10 avgLastModified
				// 11 lastAccess
				// 12 avgLastAccess
				// 13 databaseUpdates
				// 14 modulesWithUpdates
				// 15 modulesWithSecurityUpdates

				for (var i in rankedArray) {
					response.data[i].attributes['complexity'] = rankedArray[i][0] + rankedArray[i][1] * 2 + rankedArray[i][2] + rankedArray[i][3];
					response.data[i].attributes['size'] = rankedArray[i][4] + rankedArray[i][5] + rankedArray[i][6] + rankedArray[i][7] + rankedArray[i][8];
					response.data[i].attributes['activity'] = rankedArray[i][9] * 2 + rankedArray[i][10] + rankedArray[i][11] * 2 + rankedArray[i][12];
					response.data[i].attributes['health'] = (rankedArray[i][13] + rankedArray[i][14] + rankedArray[i][15] * 3) * -1;
				}

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