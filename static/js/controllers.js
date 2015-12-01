var controllers = angular.module('dewyControllers', []);

controllers.controller('appController', ['$scope', '$http', '$route',
	function ($scope, $http, $route) {
		if ($route.current.page == 'filter') {
			$scope.page = 'templates/filter.html';
		}
		else if ($route.current.page == 'sites') {
			$scope.page = 'templates/sites.html';
		}

		// Need to get this from session
		// Dummy data for now
		$scope.user = {
			username: 'Derek'
		}
}]);

controllers.controller('signonController', ['$scope',
	function ($scope) {
}]);

controllers.controller('sitesController', ['$scope', '$routeParams', 'filterFactory',
	function ($scope, $routeParams, filterFactory) {
		$scope.getNumber = function(number) {
			return new Array(Math.round(number));
		}
		$scope.changeSorting = function(column) {
			var sort = $scope.sort;

			if (sort.column == column) {
				sort.descending = !sort.descending;
			} else {
				sort.column = column;
				sort.descending = false;
			}
		};
		$scope.sort = {
			column: 'title',
			descending: false
		};

		$scope.filters = filterFactory.getByUser(null);
		$scope.currentFilter = filterFactory.getFilter($scope.filters, $routeParams.filter);

		// $http.get('http://dewy.io/api/sites').success(function(data) {
		// 	$scope.sites = data;
		// });
		$scope.sites = [
			{
				title: 'Photography Blog',
				base_url: 'photographybyderek.ca/blog',
				complexity: 3.53,
				size: 10,
				activity: 4.42,
				health: 1
			},
			{
				title: 'Derek McBurney',
				base_url: 'derekmcburney.com',
				complexity: 1,
				size: 4.17,
				activity: 7.35,
				health: 6.4
			},
			{
				title: 'my world, my choice!',
				base_url: 'myworldmychoice.org',
				complexity: 1,
				size: 6.12,
				activity: 4.92,
				health: 4.55
			}
		];
}]);
