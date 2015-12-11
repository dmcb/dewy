var controllers = angular.module('dewyControllers', []);

controllers.controller('appController', ['$scope', '$http', '$route', 'authFactory',
	function ($scope, $http, $route, authFactory) {
		if ($route.current.page == 'filter') {
			$scope.page = 'templates/filter.html';
		}
		else if ($route.current.page == 'sites') {
			$scope.page = 'templates/sites.html';
		}

		$scope.user = null;
		$scope.setUser = function(user) {
			$scope.user = user;
		}
}]);

controllers.controller('signonController', ['$scope',
	function ($scope) {
}]);

controllers.controller('filterController', ['$scope', '$http', '$routeParams', 'filterFactory',
	function ($scope, $http, $routeParams, filterFactory) {
		$scope.addRule = function(rule) {
			// New rule
			var newRule = {
				field: 'Base URL',
				choice: 'contains'
			}
			function walk(target) {
				var rules = target.rules, i;
				if (rules) {
					i = rules.length;
					while (i--) {
						if (rules[i] == rule) {
							return rules.splice(i+1, 0, newRule);
						} else {
							walk(rules[i])
						}
					}
				}
			}
			walk($scope.currentFilter);
		}
		$scope.addRuleGroup = function(rule) {
			// New rule group
			var newRuleGroup = {
				operator: 'any',
				rules: [{
					field: 'Base URL',
					choice: 'contains'
				}]
			}
			function walk(target) {
				var rules = target.rules, i;
				if (rules) {
					i = rules.length;
					while (i--) {
						if (rules[i] == rule) {
							return rules.splice(i+1, 0, newRuleGroup);
						} else {
							walk(rules[i])
						}
					}
				}
			}
			walk($scope.currentFilter);
		}
		$scope.cancel = function() {
			window.history.back();
		}
		$scope.deleteFilter = function() {
			filterFactory.delete($scope.currentFilter);
		}
		$scope.deleteRule = function(rule) {
			function walk(target) {
				var rules = target.rules, i;
				if (rules) {
					i = rules.length;
					while (i--) {
						if (rules[i] == rule) {
							return rules.splice(i, 1);
						} else {
							walk(rules[i])
						}
					}
				}
			}
			walk($scope.currentFilter);
		}
		$scope.getChoices = function(field) {
			for (var i=0; i<$scope.fields.length; i++) {
				if ($scope.fields[i].title == field) {
					return $scope.fields[i].choices;
				}
			}
		}
		$scope.hasValue = function(field) {
			for (var i=0; i<$scope.fields.length; i++) {
				if ($scope.fields[i].title == field) {
					return $scope.fields[i].value;
				}
			}
		}
		$scope.saveFilter = function() {
			filterFactory.update($scope.currentFilter);
		}
		$scope.updateChoice = function(rule) {
			choices = $scope.getChoices(rule.field);
			if (choices.indexOf(rule.choice) == -1) {
				rule.choice = choices[0];
			}
		}

		filterFactory.getOperators().then(function(result) {
			$scope.operators = result;
		});

		filterFactory.getFields().then(function(result) {
			$scope.fields = result;
		});

		filterFactory.getAll(null).then(function(result) {
			$scope.filters = result;
		});

		filterFactory.getFilter($routeParams.filter).then(function(result) {
			$scope.currentFilter = result;
		});

}]);

controllers.controller('sitesController', ['$scope', '$location', '$routeParams', 'filterFactory', 'sitesFactory',
	function ($scope, $location, $routeParams, filterFactory, sitesFactory) {
		$scope.addFilter = function() {
			$location.path('filter');
		}
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

		filterFactory.getAll(null).then(function(result) {
			$scope.filters = result;
		});

		filterFactory.getFilter($routeParams.filter).then(function(result) {
			$scope.currentFilter = result;
		});

		sitesFactory.getAll(null, $scope.currentFilter).then(function(result) {
			$scope.sites = result;
		});
}]);
