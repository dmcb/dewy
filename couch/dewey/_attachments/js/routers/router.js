var Dewey = Dewey || {
	Routers: {},
	Models: {},
	Collections: {},
	Views: {}
};

$(function( $ ) {
	'use strict';

    Dewey.Routers.AppRouter = Backbone.Router.extend({

        routes: {
            '': 'index'
        },

        initialize: function(options) {
            // Create sites collection
            Dewey.Collections.Sites = new Dewey.Collections.Sites();
        },

        index: function() {
            // Add sites view
            Dewey.Views.Sites = new Dewey.Views.Sites({
	            collection: Dewey.Collections.Sites
            });
        }
    });
});