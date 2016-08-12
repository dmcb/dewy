var controllers = angular.module('dewyControllers', []);

controllers.controller('accountController', ['$scope', '$timeout', '$rootScope', 'userFactory', 'authService',
	function ($scope, $timeout, $rootScope, userFactory, authService) {
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
					$scope.$emit('flashMessage', {content: 'Account information updated', type: 'message'});
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
					$scope.$emit('flashMessage', {content: 'Profile information updated', type: 'message'});
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
				$scope.$emit('flashMessage', {content: 'Verification email sent', type: 'message'});
			});
		}
}]);

controllers.controller('appController', ['$scope', '$location', '$timeout', 'authService',
	function ($scope, $location, $timeout, authService) {
		$scope.signOff = function() {
			authService.signOff();
		}
		$scope.$on('currentUser:finishUpdate', function(event, data) {
			$scope.currentUser = data;
		});
		$scope.$on('flashMessage', function(event, data) {
			if (!$scope.flashMessages[0] || $scope.flashMessages[0].content != data.content) {
				$scope.flashMessages.unshift(data);
				$timeout(function() {
					$scope.flashMessages.pop();
				}, 3500);
			}
		});
		$scope.flashMessages = [];
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
			placeholder: "dropdown-placeholder",
			stop: function(e, ui) {
				// Check if there are rule groups to delete because they are now empty after a move
				$scope.deleteRule(null);
			}
		};
}]);

controllers.controller('filtersController', ['$scope', 'filters', 'filterIndex', 'filterFactory',
	function ($scope, filters, filterIndex, filterFactory) {
		$scope.addFolder = function(filter) {
			var newFolder = {
				folder: 'New folder',
				filters: []
			}
			function walk(target) {
				var filters = target.filters, i;
				if (filters) {
					i = filters.length;
					while (i--) {
						if (filters[i] == filter) {
							// If your adding from a folder, insert into that folder
							if (filters[i].filters) {
								return filters[i].filters.splice(0, 0, newFolder);
							} else {
								return filters.splice(i+1, 0, newFolder);
							}
						} else {
							walk(filters[i])
						}
					}
				}
			}
			walk($scope.filterIndex);
			filterFactory.updateIndex($scope.filterIndex);
		}

		$scope.deleteFolder = function(filter) {
			function walk(target) {
				var filters = target.filters, i;
				if (filters) {
					i = filters.length;
					while (i--) {
						if (filters[i] == filter) {
							var deletedFilter = filters.splice(i, 1);
							// If the folder being deleted has child filters, move them up
							if (deletedFilter[0].filters) {
								var j = deletedFilter[0].filters.length;
								while (j--) {
									filters.splice(i, 0, deletedFilter[0].filters[j]);
								}
							}
							return;
						}
						else {
							walk(filters[i]);
						}
					}
				}
			}
			walk($scope.filterIndex);
			filterFactory.updateIndex($scope.filterIndex);
		}

		$scope.updateIndex = function() {
			filterFactory.updateIndex($scope.filterIndex);
		}

		$scope.filters = filters;
		$scope.filterIndex = filterIndex;
		$scope.sortableOptions = {
			connectWith: ".filter-group",
			handle: ".handle",
			helper: "clone",
			opacity: 0.75,
			placeholder: "dropdown-placeholder",
			update: function(e, ui) {
				// console.log(ui.item.sortable.model);
				// console.log(ui.item.sortable.sourceModel);
				// console.log(ui.item.sortable.dropindex);
				// var getDepth = function(target) {
				// 	var depth = 0;
				// 	if (target.filters) {
				// 		target.filters.forEach(function(filter) {
				// 			var tmpDepth = getDepth(filter);
				// 			if (tmpDepth > depth) {
				// 				depth = tmpDepth
				// 			}
				// 		});
				// 	return 1 + depth;
				// 	}
				// }

				// var depth = getDepth($scope.filterIndex);
				// console.log('Depth ' + depth);
				// if (depth > 4) {
				// 	ui.item.sortable.cancel();
				// }
			},
			stop: function(e, ui) {
				filterFactory.updateIndex($scope.filterIndex);
			}
		};
}]);

controllers.controller('manageController', ['$scope', '$timeout', '$moment', 'sites', 'user', 'sitesFactory', 'userFactory',
	function ($scope, $timeout, $moment, sites, user, sitesFactory, userFactory) {
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
				$scope.$emit('flashMessage', {content: 'API key reset', type: 'message'});
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

controllers.controller('signonController', ['authService', '$scope', '$http', 'ENV',
	function (authService, $scope, $http, ENV) {
		$scope.submit = function() {
			if ($scope.form.$valid) {
				$scope.message = null;
				// Authenticate
				$http.post(ENV.api + 'oauth/token', {
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

controllers.controller('signupController', ['authService', '$scope', '$http', 'ENV',
	function (authService, $scope, $http, ENV) {
		$scope.check = function(field) {
			if ($scope.form[field].$valid) {
				var post = {};
				post[field] = $scope[field];
				post['check'] = true;
				$http.post(ENV.api + 'users', post)
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
				$http.post(ENV.api + 'users', {
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

controllers.controller('overviewController', ['$scope', '$location', 'sitesFactory', 'filters', 'filterIndex', 'data',
	function ($scope, $location, sitesFactory, filters, filterIndex, data) {
		$scope.changeFilter = function(fid) {
			if (fid) {
				$location.path($scope.view + '/' + fid);
			}
			else {
				$location.path($scope.view);
			}
		}
		$scope.getNumber = function(number) {
			return new Array(Math.round(number));
		}
		$scope.openFolder = function(index) {
			console.log(index);
			$scope.folders[index] = !$scope.folders[index];
			console.log($scope.folders);
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

		$scope.filterIndex = filterIndex;
		$scope.filters = filters;

		var comb = function(filters, level, result) {
			var prefix = '';
			for (var i=0; i<level; i++) {
				prefix = prefix + '---';
			}
			for (var i=0; i<filters.length; i++) {
				if (filters[i].filters && filters[i].filters.length) {
					result.push({title: prefix + ' ' + filters[i].folder});
					comb(filters[i].filters, level+1, result);
				}
				else if (filters[i].fid) {
					result.push({title: prefix + ' ' + $scope.filters[filters[i].fid].title, fid: filters[i].fid });
				}
			}
		}
		$scope.filterDropdown = [];
		comb($scope.filterIndex.filters, 0, $scope.filterDropdown);
}]);

controllers.controller('overviewContentController', ['$scope',
	function ($scope) {
}]);

controllers.controller('overviewModulesController', ['$scope', 'moduleFactory',
	function ($scope, moduleFactory) {
		$scope.changeSorting = function(column) {
			var sort = $scope.sort;

			if (sort.column == column) {
				sort.descending = !sort.descending;
			} else {
				sort.column = column;
				sort.descending = false;
			}
		}
		$scope.openDetails = function(index, detail) {
			// If the module is already open to that same module and view, close the view
			if ($scope.openModule && $scope.openModule.index == index && $scope.openModule.detail == detail) {
				$scope.openModule = null;
			}
			else {
				$scope.openModule = $scope.modules[index];
				$scope.openModule.detail = detail;
				$scope.openModule.index = index;
			}
		}
		
		$scope.sort = {
			column: 'module',
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
					}
				}
				sitesFactory.setTags($scope.openSite);
				$scope.sites[siteIndex].tags = $scope.openSite.tags;
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
			$scope.openSite.tags.splice(tagIndex, 1);
			$scope.sites[siteIndex].tags = $scope.openSite.tags;
			sitesFactory.setTags($scope.openSite);
		}
		$scope.openDetails = function(index, detail) {
			// If the site is already open to that same site and view, close the view
			if ($scope.openSite && $scope.openSite.sid == $scope.sites[index].sid && $scope.openSite.detail == detail) {
				$scope.openSite = null;
			}
			else {
				// If details haven't been already loaded for the site, go grab the site details
				if (!('details' in $scope.sites[index])) {
					sitesFactory.getDetails($scope.sites[index].sid).then(function(details) {
						$scope.sites[index].details = details;
						$scope.openSite = $scope.sites[index];
						$scope.openSite.detail = detail;
						if (!$scope.openSite.tags) {
							$scope.openSite.tags = [];
						}
					});
				} else {
					$scope.openSite = $scope.sites[index];
					$scope.openSite.detail = detail;
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

controllers.controller('subscriptionController', ['$scope', '$timeout', '$rootScope', 'userFactory', 'authService', 'ENV',
	function ($scope, $timeout, $rootScope, userFactory, authService, ENV) {
		// Stripe.JS method
		$scope.saveCustomer = function(status, response) {
			$scope.error = null;
			$scope.disabled = true;
			if (status == 200) {
				$scope.error = null;
				return userFactory.subscribe($scope.currentUser.uid, response.id, $scope.plan)
				.error(function(error, status) {
					$scope.error = error;
					$scope.disabled = false;
				})
				.success(function(response) {
					$scope.error = response;
				});
			}
			else {
				$scope.error = response.error.message;
				$scope.disabled = false;
			}
		};

		$scope.setPlan = function(plan) {
			$scope.plan = plan;
		}

		// Information for checkout method
		$scope.stripeEndPoint = ENV.api + 'users/_subscription/' + $scope.currentUser.uid;
		$scope.stripePublicKey = ENV.stripePublicKey;

		$scope.disabled = false;
		$scope.plan = 'basic';
}]);

controllers.controller('verifyController', ['$scope', 'verifyData',
	function ($scope, verifyData) {
		$scope.error = verifyData.error;
}]);

