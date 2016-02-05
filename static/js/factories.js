var factories = angular.module('dewyFactories', []);

factories.factory('authInterceptor', ['$q', function($q) {
	var authInterceptor = {};

	authInterceptor.response = function(response) {
		return response;
	};

	authInterceptor.responseError = function(rejection) {
		if (rejection.status == 401) {
			// Unauthorized
			// Do a login or something
		}
		return rejection;
	};

	return authInterceptor;
}]);

factories.factory('filterFactory', ['$http', function($http) {
	var filterFactory = {};
	var apiUrl = "http://api.dewy.io/1.0";

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
				return response.data;
			});
	}

	filterFactory.getFields = function() {
		return $http.get(apiUrl + '/fields/values', {cache: true})
			.then(function (response) {
				return response.data;
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
		return $http.get(apiUrl + '/field/operators', {cache: true})
			.then(function (response) {
				return response.data;
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
	var apiUrl = "http://api.dewy.io/1.0";

	sitesFactory.get = function(user, siteId, detail) {
		return $http.get(apiUrl + '/sites/' + siteId)
			.then(function (response) {
				return response.data;
			});
	}

	sitesFactory.getAll = function(user, filter) {
		return $http.get(apiUrl + '/sites/_filter/' + filter)
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

factories.factory('tagFactory', ['$http', function($http) {
	var tagFactory = {};
	var apiUrl = "http://api.dewy.io/1.0";

	tagFactory.getAll = function(user) {
		return $http.get(apiUrl + '/tags')
			.then(function (response) {
				return response.data;
			});
	}

	return tagFactory;
}]);