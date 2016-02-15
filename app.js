// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

// Express configuration
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Proxy API endpoints
var authRoutes = require('./routes/auth');
var apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Send all remaining routes to Angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

module.exports = app;
