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
                var options = {};
                if (req.body.remember) {
                    options.maxAge = 1000 * 60 * 60 * 24 * 30;
                }
                res.cookie('token', token, options);
                res.status(response.statusCode).send({"message": "success", "data": "Authenticated."});
            }
        }
    });
});

app.all('/auth/*', function(req, res) {
    // If we have a token, decrypt and add OAuth information to request
    // if TOKEN {
    //     var header = {
    //         Authorization: 'Bearer ' + access_token
    //     }
    // }
    var header = null;
    var endPoint = 'http://api.dewy.io/1.0/' + req.params[0];
    var request = require('request');
    request({
        uri: endPoint,
        method: req.method,
        json: req.body,
        header: header
    }, function(error, response, body) {
        if (error) {
            res.status(response.statusCode).send({"message": "error", "data": error});
        }
        else {
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
