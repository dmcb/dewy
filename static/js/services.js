var services = angular.module('dewyServices', []);

services.service('Session', function () {
	this.create = function (sessionid, userid, username) {
		this.id = sessionid;
		this.userid = userid;
		this.username = username;
	};
	this.destroy = function () {
		this.id = null;
		this.userid = null;
		this.username = null;
	};
})