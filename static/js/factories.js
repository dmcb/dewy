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

	filterFactory.create = function(filter) {
		return $http.post(apiUrl + '/filters', filter)
			.then(function (response) {
				console.log(response);
			});
	}

	filterFactory.delete = function(filterId) {
		return $http.delete(apiUrl + '/filters/' + filterId);
	}

	filterFactory.getAll = function(user) {
		return $http.get(apiUrl + '/filters')
			.then(function (response) {
				return response.data.data;
			});
	}

	filterFactory.getFields = function() {
		return $http.get(apiUrl + '/fields/values', {cache: true})
			.then(function (response) {
				return response.data.data;
			});
	}

	filterFactory.getFilter = function(url) {
		return $http.get(apiUrl + '/filters/' + url)
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
				return response.data.data;
			});
	}

	filterFactory.update = function(filter) {
		return $http.put(apiUrl + '/filters/' + filter.id, filter)
			.then(function (response) {
				console.log(response);
			});
	}

	return filterFactory;
}]);

factories.factory('sitesFactory', ['$http', function($http) {
	var sitesFactory = {};
	var apiUrl = "http://dewy.io/auth";

	sitesFactory.get = function(user, siteId, detail) {
		return $http.get(apiUrl + '/sites/' + siteId)
			.then(function (response) {
				return response.data.data;
			});
	}

	sitesFactory.getAll = function(user, filter) {
		return $http.get(apiUrl + '/sites/_filter/' + filter)
			.then(function (response) {
				return response.data.data;
			});
	}

	sitesFactory.getTags = function() {
		return $http.get(apiUrl + '/sites/_tags')
			.then(function (response) {
				return response.data.data;
			});
	}

	sitesFactory.setTags = function(site) {
		var update = {
			type: 'tags',
			tags: site.details.tags
		};
		return $http.put(apiUrl + '/sites/' + site.id, update)
			.then(function (response) {
				return response.data.data;
			});
	}

	return sitesFactory;
}]);