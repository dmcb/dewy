var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jwt-simple');

router.all('/*', function(req, res) {
    // Check if a JWT was passed from the Angular app to this proxy API
    if (req.headers.authorization) {
        // Get JWT token from header
        var token = req.headers.authorization.substr('Bearer '.length);

        // Decode JWT and send OAuth header to actual API
        var headers = {};
        try {
            var payload = JSON.parse(jwt.decode(token, config.jwt.secret));
            headers.Authorization = 'Bearer ' + payload['access_token'];
        }
        catch (error) {
            console.log(error);
        }
        
        // Send request, return results to Angular app
        var endPoint = 'http://api.dewy.io/1.0/' + req.params[0];
        console.log(req.method + ': ' + endPoint);
        var request = require('request');
        request({
            uri: endPoint,
            method: req.method,
            json: req.body,
            headers: headers
        }, function(error, response, body) {
            if (error) {
                console.log(error);
                res.status(response.statusCode).send(error);
            }
            else {
                res.status(response.statusCode).send(body);
            }
        });
    } else {
        res.status(401).end();
    }
});

module.exports = router;