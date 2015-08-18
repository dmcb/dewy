var Dewey = Dewey || {
	Routers: {},
	Models: {},
	Collections: {},
	Views: {}
};

$(function( $ ) {
	'use strict';

	Dewey.Views.Site = Backbone.View.extend({
		template: _.template($('#site').html()),

		initialize: function() {
			this.model.bind('reset', this.render, this);
		},

		render: function() {
			$(this.el).html(this.template(this.model.attributes));

			var factors = ['complexity', 'size', 'activity', 'health'];
			var pointTemplate = _.template($('#point').html());
			for (var factor in factors) {
				var points_html = this.$('.' + factors[factor] + ' ' + '.points');
				var points = this.model.get('relative_' + factors[factor]);
				points_html.addClass('points' + points);
				for (var i=0; i<points; i++) {
					points_html.append(pointTemplate);
				}
			}

			return this
		}
	})

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
				site.attributes['complexity'] = Math.log(site.attributes['modules'] + site.attributes['content_types'] + site.attributes['roles']);
				site.attributes['size'] = Math.log(site.attributes['nodes'] + site.attributes['words'] + site.attributes['users'] + site.attributes['files']);
				site.attributes['activity'] = Math.log(Date.parse(site.attributes['last_access']) + Date.parse(site.attributes['last_modification']));
				site.attributes['health'] = Math.log(3);

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
				factors[factor]['increment'] = (factors[factor]['maximum'] - factors[factor]['minimum']) / 9;
			}

			// Render
			this.collection.each(function(site) {
				for (var factor in factors) {
					site.attributes['relative_' + factor] = Math.round((site.attributes[factor] - factors[factor]['minimum']) / factors[factor]['increment']) + 1;
					// Should there be no increment in the range because all sites are the same or there's only one, set relative values in the middle
					if (factors[factor]['increment'] == 0) {
						// var tpl = _.template("<h1>LOL</h1>");
						site.attributes['relative_' + factor] = 5;
					}
				}

				var view = new Dewey.Views.Site({
					model: site
				});
				sites.append(view.render().el);
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