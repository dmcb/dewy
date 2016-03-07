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
        var endPoint = config.api.url + req.params[0];
        var request = require('request');
        request({
            uri: endPoint,
            method: req.method,
            json: req.body,
            headers: headers
        }, function(error, response, body) {
            if (error) {
                res.status(response.statusCode).send(error);
            }
            else {
                console.log(response.statusCode + ' - ' + req.method + ': ' + endPoint);
                if (response.statusCode == '401') {
                    // We may have an expired access_token on our hands
                    // Let's try to get a new one via our refresh token
                    console.log('401 received, attempting to get new access token');
                    var encodedClient = new Buffer(config.client.client_id + ':' + config.client.client_secret).toString('base64');
                    var refreshRequest = require('request');
                    refreshRequest({
                        uri: config.api.url + 'oauth/token',
                        body: 'grant_type=refresh_token&refresh_token=' + payload['refresh_token'],
                        method: 'post',
                        headers: {
                            'Authorization': 'Basic ' + encodedClient,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }, function(refreshError, refreshResponse, refreshBody) {
                        if (refreshResponse.statusCode == '200') {
                            console.log('Attempt succeeded, sending 401 with new token');
                            console.log(refreshBody);
                            var token = jwt.encode(refreshBody, config.jwt.secret);
                            res.status(401).end(token);
                        }
                        else {
                            // We tried, we failed
                            // User very likely must reauthenticate
                            // Pass on the 401 to indicate that to web app
                            console.log('Attempt failed, sending 401');
                            console.log(refreshResponse.statusCode);
                            console.log(refreshBody);
                            res.status(401).end();
                        }
                    });
                } else {
                    res.status(response.statusCode).send(body);
                }
            }
        });
    } else {
        res.status(401).end();
    }
});

module.exports = router;