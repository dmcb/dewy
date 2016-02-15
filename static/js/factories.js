var factories = angular.module('dewyFactories', []);

factories.factory('authInterceptor', ['$location', '$q', '$window', function($location, $q, $window) {
	var authInterceptor = {};

	authInterceptor.request = function(config) {
		config.headers = config.headers || {};
		if ($window.localStorage.token) {
			config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
		} else if ($window.sessionStorage.token) {
			config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
		}
		return config;
	}

	authInterceptor.responseError = function(responseError) {
		if (responseError.status == 401) {
			// Unauthorized
			console.log('Access denied');
			$location.path("/signon");
		}
		return $q.reject(responseError);
	};

	return authInterceptor;
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
					response.data[i].complexity = Math.log(response.data[i].attributes.modules + response.data[i].attributes.contentTypes + response.data[i].attributes.roles);
					response.data[i].size = Math.log(response.data[i].attributes.nodes + response.data[i].attributes.words + response.data[i].attributes.users + response.data[i].attributes.diskSize);
					response.data[i].activity = Math.log(response.data[i].attributes.avgLastAccess + response.data[i].attributes.avgLastModified);
					response.data[i].health = Math.log(3);

					for (var attribute in attributes) {
						if (attributes[attribute]['maximum'] == null) {
							attributes[attribute]['maximum'] = response.data[i][attribute];
						} else if (attributes[attribute]['maximum'] < response.data[i][attribute]) {
							attributes[attribute]['maximum'] = response.data[i][attribute];
						}
						if (attributes[attribute]['minimum'] == null) {
							attributes[attribute]['minimum'] = response.data[i][attribute];
						} else if (attributes[attribute]['minimum'] > response.data[i][attribute]) {
							attributes[attribute]['minimum'] = response.data[i][attribute];
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
							response.data[i][attribute] = ((response.data[i][attribute] - attributes[attribute]['minimum']) / attributes[attribute]['increment']) + 1;
						}
					}
				}

				return response.data;
			});
	}

	sitesFactory.getTags = function() {
		return $http.get(apiUrl + '/sites/_tags')
			.then(function (response) {
				return response.data;
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