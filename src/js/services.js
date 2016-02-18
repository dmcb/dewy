var services = angular.module('dewyServices', []);

services.service('dewySession', ['$window', function ($window) {
	this.create = function (result, remember) {
		this.remember = remember;
		if (remember) {
			$window.localStorage.token = result;
		}
		$window.sessionStorage.token = result;
	}
	this.destroy = function () {
		delete $window.localStorage.token;
		delete $window.localStorage.user;
		delete $window.sessionStorage.token;
		delete $window.sessionStorage.user;
	}
	this.getToken = function() {
		if ($window.sessionStorage.token) {
			return $window.sessionStorage.token;
		}
		else if ($window.localStorage.token) {
			return $window.localStorage.token
		}
		return null;
	}
	this.getUser = function() {
		if ($window.sessionStorage.user) {
			return JSON.parse($window.sessionStorage.user);
		}
		else if ($window.localStorage.user) {
			return JSON.parse($window.localStorage.user);
		}
		return null;
	}
	this.setUser = function(user) {
		if (this.remember) {
			$window.localStorage.user = JSON.stringify(user);
		}
		$window.sessionStorage.user = JSON.stringify(user);
	}
}]);