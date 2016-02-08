// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var forge = require('node-forge');
var jwt = require('jwt-simple');
var config = require('./config');
var app = express();

// Express configuration
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Provide OAuth proxy for Angular app
app.post('/auth/', function(req, res) {
    console.log(req.body);
    var endPoint = 'http://api.dewy.io/1.0/oauth/token';
    var encodedClient = new Buffer(config.client.client_id + ':' + config.client.client_secret).toString('base64');
    var request = require('request');
    req.body.password = forge.md.sha1.create().update(req.body.password).digest().toHex();
    request({
        uri: endPoint,
        method: req.method,
        body: 'grant_type=password&username=' + req.body.username + '&password=' + req.body.password,
        headers: {
            'Authorization': 'Basic ' + encodedClient,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }, function(error, response, body) {
        if (error) {
            res.status(response.statusCode).send({"message": "error", "data": error});
        }
        else {
            if (response.statusCode == '400') {
                res.status(response.statusCode).send({"message": "error", "data": "Your username and password combination is incorrect, please try again."});
            } 
            else if (response.statusCode != '200') {
                res.status(response.statusCode).send({"message": "error", "data": "Dewy could not authenticate at this time."});
            }
            else {
                var token = jwt.encode(body, config.jwt.secret);
                res.status(response.statusCode).send({"message": "success", "data": token});
            }
        }
    });
});

app.all('/auth/*', function(req, res) {
    // Check if a JWT was passed from the Angular app to this proxy API
    var headers = {};
    if (req.headers.authorization) {
        // Get JWT token from header
        var token = req.headers.authorization.substr('Bearer '.length);

        // Decode JWT and send OAuth header to actual API
        try {
            var payload = JSON.parse(jwt.decode(token, config.jwt.secret));
            headers.Authorization = 'Bearer ' + payload['access_token'];
        }
        catch (err) {
            console.log(err);
        }
    }
    var endPoint = 'http://api.dewy.io/1.0/' + req.params[0];
    var request = require('request');
    request({
        uri: endPoint,
        method: req.method,
        json: req.body,
        headers: headers
    }, function(error, response, body) {
        if (error) {
            console.log(error);
            res.status(response.statusCode).send({"message": "error", "data": error});
        }
        else {
            console.log(body);
            if (body.message == 'error') {
                res.status(response.statusCode).send({"message": "error", "data": body.data});
            } else {
                res.status(response.statusCode).send({"message": "success", "data": body.data});
            }
        }
    });

    // Send request, return results to Angular app
    console.log(req.method + ': ' + endPoint);

});

// Send all remaining routes to Angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

module.exports = app;
