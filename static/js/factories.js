var factories = angular.module('dewyFactories', []);

factories.factory('filterFactory', ['$http', function($http) {
	var filterFactory = {};
	var apiUrl = "/api/1.0";

	filterFactory.delete = function(filter) {

	}

	filterFactory.getAll = function(user) {
		return $http.get(apiUrl  + '/filters')
			.then(function (response) {
				return response.data;
			});
	}

	filterFactory.getFields = function() {
		return $http.get(apiUrl + '/fields')
			.then(function (response) {
				return response.data;
			});
	}

	filterFactory.getFilter = function(url) {
		return $http.get(apiUrl + '/filters/' + url)
			.then(function (response) {
				return response.data;
			});
	}

	filterFactory.getOperators = function() {
		return $http.get(apiUrl + '/operators')
			.then(function (response) {
				return response.data;
			});
	}

	filterFactory.update = function(filter) {
		return $http.post(apiUrl  + '/filters', filter)
			.then(function (response) {
				console.log(response);
			});
	}

	return filterFactory;
}]);

factories.factory('sitesFactory', ['$http', function($http) {
	var sitesFactory = {};
	var apiUrl = "/api/1.0";

	sitesFactory.getAll = function(user, filter) {
		return $http.get(apiUrl  + '/sites/' + filter)
			.then(function (response) {
				return response.data;
			});
	}

	return sitesFactory;
}]);
