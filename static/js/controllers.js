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

controllers.controller('signonController', ['$scope', '$http',
	function ($scope, $http) {
}]);

controllers.controller('sitesController', ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {
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

		$scope.currentFilter = $routeParams.filter;
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

		$scope.filters = [
			{
				title: 'In development',
				url: 'in-development',
				notifications: true,
				operator: 'any',
				rules: [
					{
						field: 'Maintenance mode',
						choice: 'is on'
					},
					{
						field: 'Tag',
						choice: 'are present',
						value: 'development'
					}
				]
			},
			{
				title: 'Modules',
				children: [
					{
						title: 'Views',
						url: 'views',
						operator: 'all',
						rules: [
							{
								field: 'Module name',
								choice: 'is',
								value: 'views'
							},
							{
								field: 'Content type',
								choice: 'starts with',
								value: 'view_reference'
							}
						]
					},
					{
						title: 'Big webform sites',
						url: 'big-webform-sites',
						notifications: true,
						operator: 'all',
						rules: [
							{
								field: 'Module name',
								choice: 'contains',
								value: 'webform'
							},
							{
								operator: 'any',
								rules: [
									{
										field: 'Number of hits in past month',
										choice: 'is greater than',
										value: 7000
									},
									{
										field: 'Number of nodes',
										choice: 'is greater than',
										value: 5000
									}
								]
							}
						]
					}
				]
			},
			{
				title: 'Really long title to serve as an edge case for the design',
				url: 'really-long-title-to-serve-as-an-edge-case-for-the-design',
				notifications: true
			},
			{
				title: 'Anotherreallylongtitlewithoutbreaksthanksjerk',
				url: 'anotherreallylongtitlewithoutbreaksthanksjerk',
			}
		]
}]);
