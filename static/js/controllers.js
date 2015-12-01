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

controllers.controller('sitesController', ['$scope', '$routeParams', 'filterFactory', 'sitesFactory',
	function ($scope, $routeParams, filterFactory, sitesFactory) {
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
		$scope.sites = sitesFactory.getByFilter(null, $scope.currentFilter);
}]);
