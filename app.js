// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config');
var app = express();

// Express configuration
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Provide OAuth proxy for Angular app
app.all('/auth/*', function(req, res) {

    // Create API endpoint URL
    var endpoint = 'http://api.dewy.io/1.0/' + req.params[0];
    console.log(req.method + ':' + endpoint);

    // Add OAuth information to request
    var apiRequest = req.body;
    apiRequest['grant_type'] = 'password';
    apiRequest['client_id'] = config.client.client_id;
    apiRequest['client_secret'] = config.client.client_secret;
    console.log(apiRequest);

    // Make request, send results to Angular app
    var request = require('request');
    request({
        uri: endpoint,
        method: req.method,
        json: apiRequest
    }, function(error, response, body) {
        if (error) {
            res.send(error);
        }
        else {
            res.send(body);
        }
    });
});

// Send all remaining routes to Angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

module.exports = app;
