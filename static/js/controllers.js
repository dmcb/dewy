var controllers = angular.module('dewyControllers', []);

controllers.controller('appController', ['$scope', '$http', '$route', 'authFactory',
	function ($scope, $http, $route, authFactory) {
		$scope.user = null;
		$scope.setUser = function(user) {
			$scope.user = user;
		}
}]);

controllers.controller('filterController', ['$scope', '$http', 'filterFactory', 'operators', 'fields', 'filters', 'currentFilter',
	function ($scope, $http, filterFactory, operators, fields, filters, currentFilter) {
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

		$scope.operators = operators;
		$scope.fields = fields;
		$scope.filters = filters;
		$scope.currentFilter = currentFilter;
}]);

controllers.controller('sitesController', ['$scope', '$location', 'filters', 'currentFilter', 'sites',
	function ($scope, $location, filters, currentFilter, sites) {
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

		$scope.filters = filters;
		$scope.currentFilter = currentFilter;
		$scope.sites = sites;
}]);
