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
				site.attributes['enabledmodulecount'] = _.filter(site.attributes['projects'], function(module){ return module[1] == "enabled"; }).length;
				site.attributes['totalmodulecount'] = site.attributes['projects'].length;
				site.attributes['usercount'] = site.attributes['users'].length;
				site.attributes['rolecount'] = _.uniq(_.pluck(site.attributes['users'], 'role')).length;
				site.attributes['lastaccess'] = new Date(_.max(site.attributes['users'], function(user){ return user.access; })['access']*1000);
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