var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jwt-simple');

router.post('/signon', function(req, res) {
    var endPoint = 'http://api.dewy.io/1.0/oauth/token';
    var encodedClient = new Buffer(config.client.client_id + ':' + config.client.client_secret).toString('base64');
    var request = require('request');
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
            res.status(response.statusCode).send(error);
        }
        else {
            if (response.statusCode == '200') {
                var token = jwt.encode(body, config.jwt.secret);
                res.send(token);             
            }
            else {
                res.status(response.statusCode).end();
            }
        }
    });
});

router.post('/signup', function(req, res) {
    var endPoint = 'http://api.dewy.io/1.0/users';
    var encodedClient = new Buffer(config.client.client_id + ':' + config.client.client_secret).toString('base64');
    var request = require('request');
    request({
        uri: endPoint,
        method: req.method,
        body: 'grant_type=password&username=' + req.body.username + '&password=' + req.body.password + '&email=' + req.body.email,
        headers: {
            'Authorization': 'Basic ' + encodedClient,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }, function(error, response, body) {
        if (error) {
            res.status(response.statusCode).send(error);
        }
        else {
            if (response.statusCode == '200') {
                console.log(body);
                var token = jwt.encode(body, config.jwt.secret);
                res.send(token);             
            }
            else if (response.statusCode == '400') {
                res.status(response.statusCode).send(body);
            }
            else {
                res.status(response.statusCode).end();
            }
        }
    });
});

module.exports = router;