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
	var apiUrl = "http://dewy.io/auth";

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
	var apiUrl = "http://dewy.io/auth";

	sitesFactory.get = function(sid, detail) {
		return $http.get(apiUrl + '/sites/' + sid)
			.then(function (response) {
				return response.data;
			});
	}

	sitesFactory.getAll = function(fid) {
		return $http.get(apiUrl + '/sites/_filter/' + fid)
			.then(function (response) {
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
			type: 'tags',
			tags: site.details.tags
		};
		return $http.put(apiUrl + '/sites/' + site.id, update)
			.then(function (response) {
				return response.data;
			});
	}

	return sitesFactory;
}]);