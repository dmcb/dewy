var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jwt-simple');

authenticateWithDewy = function() {
    return function(req, res, next) {
        var body = 'grant_type=password';
        for (property in req.body) {
            body = body + '&' + property + '=' + req.body[property];
        }
        if (req.url == '/signon') {
            var endPoint = config.api.url + 'oauth/token';
        }
        else if (req.url == '/signup') {
            var endPoint = config.api.url + 'users';
        }
        var encodedClient = new Buffer(config.client.client_id + ':' + config.client.client_secret).toString('base64');
        var request = require('request');
        request({
            uri: endPoint,
            body: body,
            method: 'post',
            headers: {
                'Authorization': 'Basic ' + encodedClient,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, function(error, response, body) {
            if (error) {
                res.status(response.statusCode).end(error);
            }
            else {
                if (response.statusCode == '200') {
                    body = JSON.parse(body);
                    if ('error' in body) {
                        res.end(body.error);
                    }
                    else {
                        var token = jwt.encode(JSON.stringify(body), config.jwt.secret);
                        res.end(token);
                    }       
                }
                else if (response.statusCode == '400') {
                    res.status(response.statusCode).end(body);
                }
                else {
                    res.status(response.statusCode).end();
                }
            }
            next();
        });
    }
}

router.post('/signon', authenticateWithDewy(), function(req, res) {});
router.post('/signup', authenticateWithDewy(), function(req, res) {});

module.exports = router;