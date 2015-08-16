var Dewey = Dewey || {
	Routers: {},
	Models: {},
	Collections: {},
	Views: {}
};

$(function( $ ) {
	'use strict';

	Dewey.Views.Sites = Backbone.View.extend({
		el: "#content",
		template: _.template($('#sites').html()),

		events: {
			"click .headers li a" : "sortSites",
		},

		initialize: function() {
			this.collection.bind('reset', this.render, this);
			this.collection.bind('sort', this.render, this);
			this.loadSites();
		},
		
		render: function() {
			$(this.el).html(this.template({ "sitecount": this.collection.length }));
			var sites = this.$('.list');
			var siteTemplate = _.template($('#site').html());

			// Loop through all sites and determine absolute values of factors
			var factors = {'complexity': [], 'size': [], 'activity': [], 'health': []};

			this.collection.each(function(site) {
				site.attributes['complexity'] = site.attributes['modules'] + site.attributes['content_types'] + site.attributes['roles'];
				site.attributes['size'] = site.attributes['nodes'] + site.attributes['words'] + site.attributes['users'] + site.attributes['files'];
				site.attributes['activity'] = Date.parse(site.attributes['last_access']) + Date.parse(site.attributes['last_modification']);
				site.attributes['health'] = 3;

				for (var factor in factors) {
					if (factors[factor]['maximum'] == null) {
						factors[factor]['maximum'] = site.attributes[factor];
					} else if (factors[factor]['maximum'] < site.attributes[factor]) {
						factors[factor]['maximum'] = site.attributes[factor];
					}
					if (factors[factor]['minimum'] == null) {
						factors[factor]['minimum'] = site.attributes[factor];
					} else if (factors[factor]['minimum'] > site.attributes[factor]) {
						factors[factor]['minimum'] = site.attributes[factor];
					}
				}
			});

			// Determine buckets from range of factor values
			for (var factor in factors) {
				factors[factor]['increment'] = (factors[factor]['maximum'] - factors[factor]['minimum']) / 4;
			}

			// Render
			this.collection.each(function(site) {
				for (var factor in factors) {
					site.attributes['relative_' + factor] = Math.round((site.attributes[factor] - factors[factor]['minimum']) / factors[factor]['increment']) + 1;
					// Should there be no increment in the range because all sites are the same or there's only one, set relative values in the middle
					if (factors[factor]['increment'] == 0) {
						site.attributes['relative_' + factor] = 3;
					}
				}

				sites.append(siteTemplate(site.attributes));
			});
		},
		   
        loadSites: function() {
	        this.collection.db = {
                view: "sites"
            };         
				
			this.collection.fetch({
				reset: true,
				group: true,
				reduce: true
			});
        },

		sortSites: function(e) {
			var target = $(e.currentTarget);
			var direction = target.attr("class");
			var factor = target.parent().attr("class");
			this.collection.comparator = function(model) {
				if (direction == "up") {
					return -model.get(factor);
				} else {
					return model.get(factor);
				}
			}
			this.collection.sort();
        }
	});
});