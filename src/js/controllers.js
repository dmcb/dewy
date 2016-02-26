var controllers = angular.module('dewyControllers', []);

controllers.controller('appController', ['$scope', '$location', 'authService',
	function ($scope, $location, authService) {
		$scope.signOff = function() {
			authService.signOff();
		}
}]);

controllers.controller('filterController', ['$scope', 'filterFactory', 'operators', 'fields', 'filters', 'currentFilter', 'tags',
	function ($scope, filterFactory, operators, fields, filters, currentFilter, tags) {
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
			filterFactory.delete($scope.currentFilter.fid)
				.then(function (response) {
					window.history.back();
				});
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
				if ($scope.currentFilter.fid) {
					filterFactory.update($scope.currentFilter);
				} else {
					filterFactory.create($scope.currentFilter);
				}
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
					rule.value = $scope.tags[0];
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

controllers.controller('manageController', ['$scope', 'sites', 'user', 'sitesFactory', 'userFactory',
	function ($scope, sites, user, sitesFactory, userFactory) {
		$scope.auditSite = function(sid) {
			return sitesFactory.audit(sid)
			.error(function(error, status) {
				console.log(error);
			})
			.success(function(result) {
				console.log(result);
			});
		}
		$scope.getKey = function() {
			$scope.apikey = user.apikey;
		}
		$scope.deleteSite = function(sid) {
			i = $scope.sites.length;
			while (i--) {
				if ($scope.sites[i].sid == sid) {
					var deletedSite = $scope.sites.splice(i, 1);
				}
			}
			sitesFactory.delete(sid);
		}
		$scope.resetKey = function(uid) {
			userFactory.resetKey(uid).then(function(apikey) {
				$scope.apikey = apikey;
			});
		}
		$scope.sites = sites;
		$scope.apikey = user.apikey;
}]);

controllers.controller('signonController', ['authService', '$scope', '$http',
	function (authService, $scope, $http) {
		$scope.submit = function() {
			if ($scope.form.$valid) {
				$scope.message = null;
				var url = 'http://dewy.io/auth/signon';
				// Authenticate
				$http.post(url, {
					username: $scope.username,
					password: $scope.password,
					remember: $scope.remember
				}).success(function(result) {
					authService.signOn(result, $scope.remember);
				})
				.error(function(error, status) {
					if (status == '400') {
						$scope.message = 'Your username and password combination is incorrect, please try again.';
					} else {
						$scope.message = 'Dewy could not authenticate at this time.';
					}
				});
			}
		}
}]);

controllers.controller('signupController', ['authService', '$scope', '$http',
	function (authService, $scope, $http) {
		$scope.submit = function() {
			if ($scope.form.$valid) {
				$scope.message = null;
				var url = 'http://dewy.io/auth/signup';
				$http.post(url, {
					username: $scope.username,
					email: $scope.email,
					password: $scope.password
				})
				.success(function(result) {
					authService.signOn(result);
				})
				.error(function(error, status) {
					if (status != '400') {
						$scope.message = 'Dewy could not sign you up at this time.';
					} else {
						$scope.error = error;
					}
				});
			}
		}
}]);

controllers.controller('sitesController', ['$scope', '$location', 'sitesFactory', 'filters', 'currentFilter',
	function ($scope, $location, sitesFactory, filters, currentFilter) {
		$scope.changeView = function(view) {
			$scope.$emit('viewChange', view);
			sessionStorage.view = JSON.stringify(view);
		}
		$scope.openFolder = function(filter) {
			$scope.folders[filter] = !$scope.folders[filter];
			sessionStorage.folders = JSON.stringify($scope.folders);
		}

		// If filter specified in URL is invalid, redirect to all sites
		$scope.currentFilter = currentFilter;
		if ($location.path() != '/sites' && !$scope.currentFilter.url) {
			$location.path('sites');
		}

		// Observe view changes
		$scope.$on('viewChange', function(event, view) {
			if (view == 'overview') {
				if (currentFilter) {
					sitesFactory.getAll(currentFilter.fid)
					.then(function (sites) {
						$scope.sites = sites;
						$scope.viewPage = 'templates/sites_overview.html';
					});
				}
				else {
					sitesFactory.getAll()
					.then(function (sites) {
						$scope.sites = sites;
						$scope.viewPage = 'templates/sites_overview.html';
					});
				}
			}
			else if (view == 'modules') {
				$scope.viewPage = 'templates/sites_modules.html';
			}
			else if (view == 'users') {
				$scope.viewPage = 'templates/sites_users.html';
			}
			else if (view == 'content') {
				$scope.viewPage = 'templates/sites_content.html';
			}
			$scope.view = view;
		})

		// Grab session folder data if it exists
		if (sessionStorage.folders) {
			$scope.folders = JSON.parse(sessionStorage.folders);
		} else {
			$scope.folders = {};
		}

		// Grab session view data if it exists
		if (sessionStorage.view) {
			$scope.$emit('viewChange', JSON.parse(sessionStorage.view));
		} else {
			$scope.$emit('viewChange', 'overview');
		}

        $scope.filters = filters;
}]);

controllers.controller('sitesOverviewController', ['$scope', 'sitesFactory', 
	function ($scope, sitesFactory) {
        $scope.addTags = function(siteIndex) {
            var formName = 'tagForm' + siteIndex;
            if (this[formName].$valid) {
                tags = this.tags.split(',');
                for (i=0; i<tags.length; i++) {
                    tag = tags[i].trim();
                    if (!$scope.sites[siteIndex].tags) {
                        $scope.sites[siteIndex].tags = [];
                    }
                    if (tag != "" && $scope.sites[siteIndex].tags.indexOf(tag) == -1) {
                        $scope.sites[siteIndex].tags.push(tag);
                        console.log($scope.sites[siteIndex].tags);
                    }
                }
                sitesFactory.setTags($scope.sites[siteIndex]);
                this.tags = null;
                this[formName].$setPristine();
                this[formName].tags.$setUntouched();
            }
        }
		$scope.changeSorting = function(column) {
			var sort = $scope.sort;

			if (sort.column == column) {
				sort.descending = !sort.descending;
			} else {
				sort.column = column;
				sort.descending = false;
			}
		}
        $scope.deleteTag = function(tagIndex, siteIndex) {
            $scope.sites[siteIndex].tags.splice(tagIndex, 1);
            sitesFactory.setTags($scope.sites[siteIndex]);
        }
        $scope.getNumber = function(number) {
            return new Array(Math.round(number));
        }
        $scope.openDetails = function(index, detail) {
            // If the site is already open to that same site and view, close the view
            if ($scope.openSite && $scope.openSite.sid == $scope.sites[index].sid && $scope.openSite.detail == detail) {
                $scope.openSite = null;
            }
            else {
                // If details haven't been already loaded for the site, go grab the site
                if (!('details' in $scope.sites[index])) {
                    sitesFactory.get($scope.sites[index].sid).then(function(details) {
                        $scope.sites[index].details = details;
                        $scope.openSite = {sid: $scope.sites[index].sid, tags: $scope.sites[index].tags, details: $scope.sites[index].details, detail: detail};
                    });
                } else {
                    $scope.openSite = {sid: $scope.sites[index].sid, tags: $scope.sites[index].tags, details: $scope.sites[index].details, detail: detail};
                }
            }
        }

        $scope.sort = {
            column: 'title',
            descending: false
        };
}]);

controllers.controller('userController', ['$scope',
	function ($scope) {
		$scope.cancel = function() {
			window.history.back();
		}
}]);
