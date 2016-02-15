var services = angular.module('dewyServices', []);

services.service('dewySession', ['$window', function ($window) {
	this.create = function (result, remember) {
		if (remember) {
			$window.localStorage.token = result.token;
			$window.localStorage.user = JSON.stringify(result.user);
		}
		$window.sessionStorage.token = result.token;
		$window.sessionStorage.user = JSON.stringify(result.user);
	};
	this.destroy = function () {
		delete $window.localStorage.token;
		delete $window.localStorage.user;
		delete $window.sessionStorage.token;
		delete $window.sessionStorage.user;
	};
	this.get = function() {
		if ($window.sessionStorage.user) {
			return JSON.parse($window.sessionStorage.user);
		}
		return null;
	}
}]);