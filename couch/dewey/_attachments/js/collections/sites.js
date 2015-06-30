var Dewey = Dewey || {
	Routers: {},
	Models: {},
	Collections: {},
	Views: {}
};

$(function( $ ) {
	'use strict';
	
	Dewey.Collections.Sites = Backbone.Collection.extend({
		model: Dewey.Models.Site
	});
	
});