var factories = angular.module('dewyFactories', []);

factories.factory('authFactory', ['$http', 'Session', function($http, Session) {
	var authService = {};

	authService.login = function (credentials) {
		return $http
			.post('/login', credentials)
			.then(function (res) {
				Session.create(res.data.id, res.data.user.id);
				return res.data.user;
		});
	};

	authService.isAuthenticated = function () {
		return !!Session.userid;
	};

	return authService;
}]);

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
		return $http.get(apiUrl + '/fields', {cache: true})
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
		return $http.get(apiUrl + '/operators', {cache: true})
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
