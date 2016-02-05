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

    // If no API path is given, we are authenticating the user against the API
    if (!req.params[0]) {
        var endPoint = 'http://api.dewy.io/1.0/oauth/token';
        var encodedClient = new Buffer(config.client.client_id + ':' + config.client.client_secret).toString('base64');
        var apiRequest = {
            uri: endPoint,
            method: req.method,
            body: 'grant_type=password&username=' + req.body.username + '&password=' + req.body.password,
            headers: {
                'Authorization': 'Basic ' + encodedClient,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    }
    // Otherwise, construct API call
    else {
        // If we have a token, decrypt and add OAuth information to request
        // if TOKEN {
        //     var header = {
        //         Authorization: 'Bearer ' + access_token
        //     }
        // }
        var header = null;
        var endPoint = 'http://api.dewy.io/1.0/' + req.params[0];
        var apiRequest = {
            uri: endPoint,
            method: req.method,
            json: req.body,
            header: header
        }
    }

    // Send request, return results to Angular app
    console.log(req.method + ': ' + endPoint);
    var request = require('request');
    request(apiRequest, function(error, response, body) {
        if (error) {
            res.status(response.statusCode).send(error);
        }
        else {
            res.status(response.statusCode).send(body);
        }
    });
});

// Send all remaining routes to Angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

module.exports = app;
