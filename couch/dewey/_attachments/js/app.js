var Dewey = Dewey || {
	Routers: {},
	Models: {},
	Collections: {},
	Views: {}
};

$(function() {
	Backbone.couch_connector.config.db_name = "dewey";
	Backbone.couch_connector.config.ddoc_name = "dewey";
	Backbone.couch_connector.config.global_changes = false;
	Backbone.couch_connector.config.base_url = 'http://dereks-macbook-pro.local/couchdb/';
	
	Dewey.router = new Dewey.Routers.AppRouter();
	Backbone.history.start();
});