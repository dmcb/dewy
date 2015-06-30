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
		},

		initialize: function() {
			this.collection.bind('reset', this.render, this);
			this.loadSites();
		},
		
		render: function() {
			$(this.el).html(this.template);
			var sites = this.$('.list');
			var siteTemplate = _.template($('#site').html());

			this.collection.each(function(site) {
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
        }
	});
});