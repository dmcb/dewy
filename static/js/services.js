var services = angular.module('dewyServices', []);

services.service('dewySession', ['$window', function ($window) {
	this.create = function (result, remember) {
		if (remember == true) {
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
		if ('token' in $window.sessionStorage) {
			return $window.sessionStorage.token;
		}
		else if ('token' in $window.localStorage) {
			return $window.localStorage.token
		}
		return null;
	}
	this.getUser = function() {
		if ('user' in $window.sessionStorage) {
			return JSON.parse($window.sessionStorage.user);
		}
		else if ('user' in $window.localStorage) {
			return JSON.parse($window.localStorage.user);
		}
		return null;
	}
	this.setUser = function(userDoc) {
		if ('user' in $window.localStorage) {
			$window.localStorage.user = JSON.stringify(userDoc);
		}
		$window.sessionStorage.user = JSON.stringify(userDoc);
	}
	this.update = function (result) {
		if ('token' in $window.localStorage) {
			$window.localStorage.token = result;
		}
		$window.sessionStorage.token = result;
	}
}]);