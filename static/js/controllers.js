var controllers = angular.module('dewyControllers', []);

controllers.controller('accountController', ['$scope', '$timeout', '$rootScope', 'userFactory', 'authService', 'flash',
	function ($scope, $timeout, $rootScope, userFactory, authService, flash) {
		$scope.cancel = function() {
			window.history.back();
		}
		$scope.check = function(uid, form, field) {
			if ($scope[form][field].$valid) {
				var post = {};
				post[field] = $scope[field];
				userFactory.checkAccount(uid, post)
				.success(function(result) {
					if (!('error' in $scope[form])) {
						$scope[form].error = {};
					}
					$scope[form].error[field] = result.error;
				});
			}
		}
		$scope.submitAccount = function(uid) {
            if ($scope.accountForm.$valid) {
           		userFactory.changeAccount(uid, $scope.passwordExisting, $scope.email, $scope.password)
				.success(function(userDoc) {
					authService.setUser(userDoc);
					flash('Account information updated');
				})
				.error(function(error, status) {
					if (status != '400') {
						$scope.accountForm.error = {error: 'Dewy could not update your account at this time.'};
					} else {
						$scope.accountForm.error = error;
					}
				});
            }
        }
		$scope.submitProfile = function(uid) {
            if ($scope.profileForm.$valid) {
                userFactory.changeProfile(uid, $scope.username)
				.success(function(userDoc) {
					authService.setUser(userDoc);
					flash('Profile information updated');
				})
				.error(function(error, status) {
					if (status != '400') {
						$scope.profileForm.error.username = 'Dewy could not update your profile at this time.';
					} else {
						$scope.profileForm.error.username = error;
					}
				});
            }
        }
        $scope.reverify = function(uid) {
            userFactory.reverify(uid)
			.then(function(userDoc) {
				flash('Verification email sent');
			});
        }
}]);

controllers.controller('appController', ['$scope', '$location', 'authService',
	function ($scope, $location, authService) {
		$scope.signOff = function() {
			authService.signOff();
		}
		$scope.$on('currentUser:updated', function(event, data) {
			$scope.currentUser = data;
		});
		$scope.currentUser = authService.currentUser();
}]);

controllers.controller('filterController', ['$scope', '$location', 'filterFactory', 'operators', 'fields', 'filters', 'currentFilter', 'tags',
	function ($scope, $location, filterFactory, operators, fields, filters, currentFilter, tags) {
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
					filterFactory.update($scope.currentFilter)
					.then(function (response) {
						$location.path('sites/' + response.data.fid);
					});
				} else {
					filterFactory.create($scope.currentFilter)
					.then(function (response) {
						$location.path('sites/' + response.data.fid);
					});
				}
			}
		}
		$scope.updateChoice = function(rule, oldRule) {
			choices = $scope.getChoices(rule.field);
			var oldChoice = rule.choice;
			rule.choice = choices[0].id;
			for (var i=0; i<choices.length; i++) {
				if (choices[i].id == oldChoice) {
					rule.choice = choices[i].id;
				}
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

controllers.controller('manageController', ['$scope', '$timeout', '$moment', 'sites', 'user', 'sitesFactory', 'userFactory', 'flash',
	function ($scope, $timeout, $moment, sites, user, sitesFactory, userFactory, flash) {
		$scope.auditSite = function(index) {
			$scope.sites[index].submitMessage = 'Auditing...';
			$scope.sites[index].submit = true;

			return sitesFactory.audit($scope.sites[index].sid)
			.error(function(error, status) {
				$scope.sites[index].submitMessage = 'Error: ' + $scope.sites[index].audited.error;
				$scope.sites[index].submitStatus = 'error'; 
				$timeout(function() {
					$scope.sites[index].submit = false;
					$scope.sites[index].submitStatus = 'submitting';
				},1500);
				$scope.sites[index].audited.date = $moment().fromNow();
				$scope.sites[index].audited.error = error.statusCode;
			})
			.success(function(result) {
				$scope.sites[index].submitMessage = 'Success';
				$scope.sites[index].submitStatus = 'success';
				$timeout(function() {
					$scope.sites[index].submit = false;
					$scope.sites[index].submitStatus = 'submitting';
					var successfulSite = $scope.sites.splice(index, 1);
				},1500);
			});
		}
		$scope.getKey = function() {
			$scope.apikey = user.apikey;
		}
		$scope.deleteSite = function(index) {
			sitesFactory.delete($scope.sites[index].sid)
			.success(function(result) {
				var deletedSite = $scope.sites.splice(index, 1);
			});
		}
		$scope.resetKey = function(uid) {
			userFactory.resetKey(uid).then(function(apikey) {
				flash('API key reset');
				$scope.apikey = apikey;
			});
		}
		$scope.sites = sites;
		for (site in $scope.sites) {
			$scope.sites[site].dateAdded = $moment($scope.sites[site].dateAdded * 1000).fromNow();
			if ('audited' in $scope.sites[site]) {
				$scope.sites[site].audited.date = $moment($scope.sites[site].audited.date * 1000).fromNow();
			}
		}
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
					password: $scope.password
				}).success(function(result) {
					authService.signOn('/sites', result, $scope.remember);
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
		$scope.check = function(field) {
			if ($scope.form[field].$valid) {
				var url = 'http://dewy.io/auth/signup';
				var post = {};
				post[field] = $scope[field];
				post['check'] = true;
				$http.post(url, post)
				.success(function(result) {
					if (!('error' in $scope)) {
						$scope.error = {};
					}
					$scope.error[field] = result;
				});
			}
		}

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
					authService.signOn('/sites', result);
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

controllers.controller('overviewController', ['$scope', '$location', 'sitesFactory', 'filters', 'data',
	function ($scope, $location, sitesFactory, filters, data) {
		$scope.changeFilter = function(fid) {
			if (fid) {
				$location.path($scope.view + '/' + fid);
			}
			else {
				$location.path($scope.view);
			}
		}
		$scope.openFolder = function(filter) {
			$scope.folders[filter] = !$scope.folders[filter];
			sessionStorage.folders = JSON.stringify($scope.folders);
		}

		// If filter specified in URL is invalid, redirect to all sites
		$scope.currentFilter = data.currentFilter;
		if ($location.path() != '/' + data.view && !('url' in $scope.currentFilter)) {
			$location.path(data.view);
		}

		// Load view
		$scope.view = data.view;
		if ($scope.view == 'sites') {
			$scope.sites = data.sites;
			$scope.viewPage = 'templates/overview_sites.html';
		}
		else if ($scope.view == 'modules') {
			$scope.modules = data.modules;
			$scope.viewPage = 'templates/overview_modules.html';
		}
		else if ($scope.view == 'users') {
			$scope.viewPage = 'templates/overview_users.html';
		}
		else if ($scope.view == 'content') {
			$scope.viewPage = 'templates/overview_content.html';
		}

		// Grab session folder data if it exists
		if (sessionStorage.folders) {
			$scope.folders = JSON.parse(sessionStorage.folders);
		} else {
			$scope.folders = {};
		}

        $scope.filters = filters;
}]);

controllers.controller('overviewContentController', ['$scope',
	function ($scope) {
}]);

controllers.controller('overviewModulesController', ['$scope',
	function ($scope) {
		$scope.changeSorting = function(column) {
			var sort = $scope.sort;

			if (sort.column == column) {
				sort.descending = !sort.descending;
			} else {
				sort.column = column;
				sort.descending = false;
			}
		}
		
	    $scope.sort = {
	        column: 'title',
	        descending: false
	    };
}]);

controllers.controller('overviewSitesController', ['$scope', 'sitesFactory', 
	function ($scope, sitesFactory) {
        $scope.addTags = function(siteIndex) {
            var formName = 'tagForm' + siteIndex;
            if (this[formName].$valid) {
                if (!$scope.openSite.tags) {
                    $scope.openSite.tags = [];
                }
                tags = this.tags.split(',');
                for (i=0; i<tags.length; i++) {
                    tag = tags[i].trim();
                    if (tag != "" && $scope.openSite.tags.indexOf(tag) == -1) {
                        $scope.openSite.tags.push(tag);
                        console.log($scope.openSite.tags);
                    }
                }
                sitesFactory.setTags($scope.openSite);
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

controllers.controller('overviewUsersController', ['$scope',
	function ($scope) {
}]);

controllers.controller('verifyController', ['$scope', 'verifyData',
	function ($scope, verifyData) {
		$scope.error = verifyData.error;
}]);

