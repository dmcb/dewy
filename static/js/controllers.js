var controllers = angular.module('dewyControllers', []);

controllers.controller('appController', ['$scope', '$http', '$route', 'authFactory',
	function ($scope, $http, $route, authFactory) {
		$scope.user = null;
		$scope.setUser = function(user) {
			$scope.user = user;
		}
}]);

controllers.controller('filterController', ['$scope', '$http', 'filterFactory', 'operators', 'fields', 'filters', 'currentFilter', 'tags',
	function ($scope, $http, filterFactory, operators, fields, filters, currentFilter, tags) {
		$scope.addRule = function(rule, group) {
			// New rule
			var newRule;
			if (group) {
				newRule = {
					operator: 'any',
					rules: [{
						field: 'Base URL',
						choice: 'contains'
					}]
				}
			} else {
				newRule = {
					field: 'Base URL',
					choice: 'contains'
				}
			}
			function walk(target) {
				var rules = target.rules, i;
				if (rules) {
					i = rules.length;
					while (i--) {
						if (rules[i] == rule) {
							$scope.currentFilter.count++;
							// If your adding from a rule group, insert into that group
							if (rules[i].rules) {
								return rules[i].rules.splice(0, 0, newRule);
							} else {
								return rules.splice(i+1, 0, newRule);
							}
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
					if (!i) {
						return 'empty';
					}
					while (i--) {
						if (rules[i] == rule) {
							var deletedRule = rules.splice(i, 1);
							// If the rule being deleted has child rules, move them up
							if (deletedRule[0].rules) {
								var j = deletedRule[0].rules.length;
								while (j--) {
									rules.splice(i, 0, deletedRule[0].rules[j]);
								}
							} else {
								// Rule is not a group
								$scope.currentFilter.count--;
							}
							// If the rule is the last in a group, flag it as empty
							if (!rules.length) {
								return 'empty'
							}
							return;
						} else {
							// If the group is now empty, delete it
							if (walk(rules[i]) == 'empty') {
								$scope.deleteRule(rules[i]);
							}
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
		$scope.getDetails = function(field) {
			for (var i=0; i<$scope.fields.length; i++) {
				if ($scope.fields[i].title == field) {
					return $scope.fields[i].details;
				}
			}
		}
		$scope.saveFilter = function() {
			if ($scope.filterForm.$valid) {
				filterFactory.update($scope.currentFilter);
			}
		}
		$scope.updateChoice = function(rule, oldRule) {
			choices = $scope.getChoices(rule.field);
			if (choices.indexOf(rule.choice) == -1) {
				rule.choice = choices[0];
			}

			details = $scope.getDetails(rule.field);
			if (details) {
				if (details.indexOf(rule.choice) == -1) {
					rule.detail = details[0];
				}
			}

			// Get field from rule
			for (var i=0; i<$scope.fields.length; i++) {
				if ($scope.fields[i].title == rule.field) {
					field = $scope.fields[i];
				}
			}
			// Get old field from rule
			for (var i=0; i<$scope.fields.length; i++) {
				if ($scope.fields[i].title == oldRule) {
					oldField = $scope.fields[i];
				}
			}

			// If field value type changes, reset value, provide default
			if (field.value != oldField.value) {
				if (field.value == 'tag') {
					rule.value = $scope.tags[0].id;
				}
				else if (field.value == 'integer') {
					rule.value = 0;
				}
				else {
					rule.value = null;
				}
			}
		}
		$scope.updateNotifications = function(notifications) {
			if (!notifications) {
				$scope.currentFilter.notifications.appears.enabled = 
				$scope.currentFilter.notifications.disappears.enabled = 
				$scope.currentFilter.notifications.total.enabled = false;
			}
		}
		$scope.valueIsType = function(field, type) {
			for (var i=0; i<$scope.fields.length; i++) {
				if ($scope.fields[i].title == field) {
					return ($scope.fields[i].value == type) ? true : false;
				}
			}
		}

		$scope.operators = operators;
		$scope.fields = fields;
		$scope.filters = filters;
		$scope.currentFilter = currentFilter;
		$scope.tags = tags;
		$scope.notificationsOn = (currentFilter.notifications.appears.enabled || currentFilter.notifications.disappears.enabled || currentFilter.notifications.total.enabled) ? true : false;
		$scope.notificationChoices = [
			'is',
			'is not',
			'is greater than',
			'is less than',
			'is greater than or equal to',
			'is less than or equal to'
		];
		$scope.sortableOptions = {
			connectWith: ".rule-group",
			handle: ".handle",
			helper: "clone",
			opacity: 0.75,
			placeholder: "rule-group-placeholder",
			stop: function(e, ui) {
				// Check if there are rule groups to delete because they are now empty after a move
				$scope.deleteRule(null);
			}
		};
}]);

controllers.controller('sitesController', ['$scope', '$location', 'sitesFactory', 'filters', 'currentFilter', 'sites',
	function ($scope, $location, sitesFactory, filters, currentFilter, sites) {
		$scope.addFilter = function() {
			$location.path('filter');
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
		$scope.getNumber = function(number) {
			return new Array(Math.round(number));
		}
		$scope.openDetails = function(index, detail) {
			if (!$scope.sites[index].details) {
				$scope.sites[index].details = sitesFactory.get(null, $scope.sites[index].id);
			}
			$scope.openSite = {id: $scope.sites[index].id, detail: detail};
		}
		$scope.openFolder = function(filter) {
			$scope.folders[filter] = !$scope.folders[filter];
			sessionStorage.folders = JSON.stringify($scope.folders);
		}

		$scope.sort = {
			column: 'title',
			descending: false
		};

		$scope.filters = filters;
		$scope.currentFilter = currentFilter;
		if ($location.path() != '/sites' && !currentFilter.url) {
			$location.path('sites');
		}
		$scope.sites = sites;

		// Grab session data if it exists
		if (sessionStorage.folders) {
			$scope.folders = JSON.parse(sessionStorage.folders);
		} else {
			$scope.folders = {};
		}
}]);

controllers.controller('userController', ['$scope',
	function ($scope) {
		$scope.cancel = function() {
			window.history.back();
		}
}]);
