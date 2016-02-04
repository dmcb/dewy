// Dependencies
var express = require('express');
var path = require('path');
var app = express();

// Express configuration
app.use(express.static(path.join(__dirname, 'static')));

// Send all routes to Angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

module.exports = app;
