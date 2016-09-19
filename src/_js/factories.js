var factories = angular.module('dewyFactories', []);

factories.factory('authInterceptor', ['$rootScope', 'authService', '$location', '$q', '$injector', '$window', function($rootScope, authService, $location, $q, $injector, $window) {
	var authInterceptor = {};

	authInterceptor.request = function(config) {
		// If there's a JWT in session, add it to all requests
		config.headers = config.headers || {};
		if ($window.localStorage.token) {
			var payload = JSON.parse($window.localStorage.token);
			config.headers.Authorization = 'Bearer ' + payload['access_token'];
		} else if ($window.sessionStorage.token) {
			var payload = JSON.parse($window.sessionStorage.token);
			config.headers.Authorization = 'Bearer ' + payload['access_token'];
		}
		return config;
	}

	authInterceptor.responseError = function(responseError) {
		// No longer authorized
		if (responseError.status == 401) {
			$rootScope.$broadcast('flashMessage', {content: 'Your session has expired', type: 'notice'});
			authService.signOff();
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

factories.factory('filterFactory', ['$http', 'ENV', function($http, ENV) {
	var filterFactory = {};

	filterFactory.create = function(filterDoc) {
		return $http.post(ENV.api + 'filters', filterDoc)
			.then(function (response) {
				return response;
			});
	}

	filterFactory.delete = function(fid) {
		return $http.delete(ENV.api + 'filters/' + fid);
	}

	filterFactory.getAll = function() {
		return $http.get(ENV.api + 'filters')
			.then(function (response) {
				return response.data;
			});
	}

	filterFactory.getIndex = function() {
		return $http.get(ENV.api + 'filters/_index')
			.then(function (response) {
				return response.data;
			});
	}

	filterFactory.getFields = function() {
		return $http.get(ENV.api + 'fields/values', {cache: true})
			.then(function (response) {
				return response.data;
			});
	}

	filterFactory.getFilter = function(fid) {
		return $http.get(ENV.api + 'filters/' + fid)
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
		return $http.get(ENV.api + 'fields/operators', {cache: true})
			.then(function (response) {
				return response.data;
			});
	}

	filterFactory.update = function(filterDoc) {
		return $http.put(ENV.api + 'filters/' + filterDoc.fid, filterDoc)
			.then(function (response) {
				return response;
			});
	}

	filterFactory.updateIndex = function(filterIndex) {
		return $http.post(ENV.api + 'filters/_index', filterIndex)
			.then(function (response) {
				return response;
			});
	}

	return filterFactory;
}]);

factories.factory('moduleFactory', ['$http', 'ENV', function($http, ENV) {
	var moduleFactory = {};

	moduleFactory.getAll = function(fid) {
		return $http.get(ENV.api + 'modules/_filter/' + fid)
			.then(function (response) {

				var arrayOfRankings = [];
				for (var i in response.data) {
					var versions = 0;
					for (version in response.data[i].versions) {
						versions = versions + 1; 
					}

					response.data[i].attributes = {
						sitesWithAvailable: response.data[i].sitesWithAvailable.length,
						sitesWithEnabled: response.data[i].sitesWithEnabled.length,
						sitesWithDatabaseUpdates: response.data[i].sitesWithDatabaseUpdates.length,
						sitesWithUpdates: response.data[i].sitesWithUpdates.length,
						sitesWithSecurityUpdates: response.data[i].sitesWithSecurityUpdates.length,
						versions: versions
					}

					var ranking = [];
					for (var j in response.data[i].attributes) {
						ranking.push(response.data[i].attributes[j]);
					}
					arrayOfRankings.push(ranking);
				}

				if (arrayOfRankings.length) {
					var length = arrayOfRankings[0].length,
					    rankedArray = Array.apply(null, { length: arrayOfRankings.length }).map(function () { return []; }),
					    temp, i;

					// For each attribute ...
					for (i = 0; i < length; i++) {
					    temp = [];
					    // ... create a temporary array of values (v) to module index (i)
					    arrayOfRankings.forEach(function (a, j) {
					        temp.push({ v: a[i], i: j });
					    });

					    // Sort temporary array by value (v) 
					    // This gives us each module ranked in order of value size
					    temp.sort(function (a, b) {
					        return a.v - b.v;
					    });

					    // Get minimum and maximum value for attribute
					    var minimum = temp[0].v;
					    var maximum = temp[temp.length-1].v;
					    var increment = (maximum - minimum) / 9;

					    // Instead of leaving in value ranges of 189,900 to 1 (which will skew results)
					    // Normalize to scale 1 out of 10
					    temp.forEach(function (a, j) {
					    	if (!increment) {
								rankedArray[a.i][i] = 1;
							}
							else {
								rankedArray[a.i][i] = ((temp[j].v - minimum) / increment) + 1;
								// rankedArray[a.i][i] = Math.log(((temp[j].v - minimum) / increment) + 1);
							}
					    });
					}

					// 0 sitesWithAvailable
					// 1 sitesWithEnabled
					// 2 sitesWithDatabaseUpdates
					// 3 sitesWithUpdates
					// 4 sitesWithSecurityUpdates
					// 5 versions

					for (var i in rankedArray) {
						response.data[i].attributes['health'] = (rankedArray[i][2] + rankedArray[i][3] * 1.5 + rankedArray[i][4] * 3) * -1;
						response.data[i].attributes['uniformity'] = (rankedArray[i][5]) * -1;
						response.data[i].attributes['utilization'] = rankedArray[i][1] / rankedArray[i][0];
						response.data[i].attributes['availability'] = rankedArray[i][0];
					}

					// Loop through all sites and determine absolute values of attributes
					var attributes = {'health': [], 'uniformity': [], 'utilization': [], 'availability': []};

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
								response.data[i][attribute] = 10;
							} 
							else {
								response.data[i][attribute] = ((response.data[i].attributes[attribute] - attributes[attribute]['minimum']) / attributes[attribute]['increment']) + 1;
							}
						}
					}
				}
				return response.data;
			});
	}

	return moduleFactory;
}]);

factories.factory('sitesFactory', ['$http', 'ENV', function($http, ENV) {
	var sitesFactory = {};

	sitesFactory.audit = function(sid) {
		var update = {
			audit: true
		};
		return $http.put(ENV.api + 'sites/' + sid, update)
			.success(function (response) {
				return response.data;
			})
			.error(function (error, status) {
				return error;
			});
	}

	sitesFactory.delete = function(sid) {
		return $http.delete(ENV.api + 'sites/' + sid);
	}

	sitesFactory.get = function(sid) {
		return $http.get(ENV.api + 'sites/' + sid)
			.then(function (response) {
				return response.data;
			});
	}

	sitesFactory.getDetails = function(sid) {
		return $http.get(ENV.api + 'sites/' + sid + '/_detail')
			.then(function (response) {
				return response.data;
			});
	}

	sitesFactory.getAll = function(fid) {
		var route = ENV.api + 'sites/_filter';
		if (fid) {
			route = route + '/' + fid;
		}
		return $http.get(route)
			.then(function (response) {

				var arrayOfRankings = [];
				for (var i in response.data) {
					var ranking = [];
					for (var j in response.data[i].attributes) {
						ranking.push(response.data[i].attributes[j]);
					}
					arrayOfRankings.push(ranking);
				}

				if (arrayOfRankings.length) {
					var length = arrayOfRankings[0].length,
					    rankedArray = Array.apply(null, { length: arrayOfRankings.length }).map(function () { return []; }),
					    temp, i;

					// For each attribute ...
					for (i = 0; i < length; i++) {
					    temp = [];
					    // ... create a temporary array of values (v) to site index (i)
					    arrayOfRankings.forEach(function (a, j) {
					        temp.push({ v: a[i], i: j });
					    });

					    // Sort temporary array by value (v) 
					    // This gives us each site ranked in order of value size
					    temp.sort(function (a, b) {
					        return a.v - b.v;
					    });

					    // Get minimum and maximum value for attribute
					    var minimum = temp[0].v;
					    var maximum = temp[temp.length-1].v;
					    var increment = (maximum - minimum) / 9;

					    // Instead of leaving in value ranges of 189,900 to 1 (which will skew results)
					    // Normalize to scale 1 out of 10
					    temp.forEach(function (a, j) {
					    	if (!increment) {
								rankedArray[a.i][i] = 1;
							}
							else {
								rankedArray[a.i][i] = ((temp[j].v - minimum) / increment) + 1;
								// rankedArray[a.i][i] = Math.log(((temp[j].v - minimum) / increment) + 1);
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
					// 13 hitsPerDay
					// 14 databaseUpdates
					// 15 projectsWithUpdates
					// 16 projectsWithSecurityUpdates
					// 17 enabledProjects

					for (var i in rankedArray) {
						response.data[i].attributes['complexity'] = rankedArray[i][0] + rankedArray[i][1] * 2 + rankedArray[i][2] + rankedArray[i][3];
						response.data[i].attributes['size'] = rankedArray[i][4] + rankedArray[i][5] + rankedArray[i][6] + rankedArray[i][7] + rankedArray[i][8];
						response.data[i].attributes['activity'] = rankedArray[i][9] * 4 + rankedArray[i][10] * 2 + rankedArray[i][11] * 2 + rankedArray[i][12] + rankedArray[i][13] * 9;
						response.data[i].attributes['health'] = (rankedArray[i][14] + rankedArray[i][15] + rankedArray[i][16] * 3) * -1;
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
								response.data[i][attribute] = 10;
							} 
							else {
								response.data[i][attribute] = ((response.data[i].attributes[attribute] - attributes[attribute]['minimum']) / attributes[attribute]['increment']) + 1;
							}
						}
						// The health stuff isn't normalized based on what sites are showing, but is a separate calculation
						var nonRelativeHealthValue = 
							Math.log(5 - (response.data[i].attributes['databaseUpdates']/response.data[i].attributes['enabledModules'] +
							response.data[i].attributes['projectsWithUpdates']/response.data[i].attributes['enabledProjects'] +
							response.data[i].attributes['projectsWithSecurityUpdates']/response.data[i].attributes['enabledProjects'] * 3)) / Math.log(5) * 9 + 1;
							// (1 - Math.log(response.data[i].attributes['databaseUpdates']/response.data[i].attributes['enabledModules'] +
							// response.data[i].attributes['projectsWithUpdates']/response.data[i].attributes['enabledProjects'] +
							// response.data[i].attributes['projectsWithSecurityUpdates']/response.data[i].attributes['enabledProjects'] * 3) / Math.log(5)) * 9 + 1;

						response.data[i]['health'] = (response.data[i]['health'] * (response.data.length-1) + nonRelativeHealthValue) / response.data.length;
					}
				}
				return response.data;
			});
	}

	sitesFactory.getOffline = function() {
		return $http.get(ENV.api + 'sites/_offline')
			.then(function (response) {
				return response.data;
			});
	}

	sitesFactory.getTags = function() {
		return $http.get(ENV.api + 'sites/_tags')
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
		return $http.put(ENV.api + 'sites/' + site.sid, update)
			.then(function (response) {
				return response.data;
			});
	}

	return sitesFactory;
}]);

factories.factory('userFactory', ['$http', '$httpParamSerializer', 'ENV', function($http, $httpParamSerializer, ENV) {
	var userFactory = {};

	userFactory.get = function() {
		return $http.get(ENV.api + 'users')
			.then(function (response) {
				return response.data;
			});
	}

	userFactory.getCustomer = function(uid) {
		return $http.get(ENV.api + 'users/' + uid + '/_subscription')
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
		return $http.put(ENV.api + 'users/' + uid, update);
	}

	userFactory.checkAccount = function(uid, post) {
		post.check = true;
		return $http.put(ENV.api + 'users/' + uid, post);
	}

	userFactory.changeProfile = function(uid, username) {
		var update = {
			username: username
		}
		return $http.put(ENV.api + 'users/' + uid, update);
	}

	userFactory.passwordRequest = function(email) {
		return $http.post(ENV.api + 'users/_reset', {email: email})
			.success(function (response) {
				return response.data;
			})
			.error(function (error, status) {
				return error;
			});
	}	

	userFactory.resetPassword = function(uid, resetCode) {
		var encodedClient = window.btoa(ENV.client_id + ':' + ENV.client_secret);
		return $http({
			method: 'POST',
			url: ENV.api + 'users/_reset/' + uid,
			headers: {
				'Authorization': 'Basic ' + encodedClient,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $httpParamSerializer({
				grant_type: 'password',
				reset_code: resetCode
			})
		});
	}

	userFactory.resetKey = function(uid) {
		var update = {
			key: true
		}
		return $http.put(ENV.api + 'users/' + uid, update)
			.then(function (response) {
				return response.data;
			});
	}

	userFactory.reverify = function(uid) {
		return $http.get(ENV.api + 'users/_verify/' + uid)
			.then(function (response) {
				return response.data;
			});
	}

	userFactory.subscribe = function(uid, stripeToken, planType) {
		return $http.post(ENV.api + 'users/' + uid + '/_subscription/' + planType, {stripeToken: stripeToken})
			.success(function (response) {
				return response.data;
			})
			.error(function (error, status) {
				return error;
			});
	}

	userFactory.verify = function(uid, verificationCode) {
		var encodedClient = window.btoa(ENV.client_id + ':' + ENV.client_secret);
		return $http({
			method: 'POST',
			url: ENV.api + 'users/_verify/' + uid,
			headers: {
				'Authorization': 'Basic ' + encodedClient,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $httpParamSerializer({
				grant_type: 'password',
				verification_code: verificationCode
			})
		});
	}

	return userFactory;
}]);