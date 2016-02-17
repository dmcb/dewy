var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jwt-simple');
var app = express();

authenticateWithDewy = function() {
    return function(req, res, next) {
        if (req.url == '/signon') {
            var body = 'grant_type=password&username=' + req.body.username + '&password=' + req.body.password;
            var endPoint = 'http://api.dewy.io/1.0/oauth/token';
        }
        else if (req.url == '/signup') {
            var body = 'grant_type=password&username=' + req.body.username + '&password=' + req.body.password + '&email=' + req.body.email;
            var endPoint = 'http://api.dewy.io/1.0/users';
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
                    var token = jwt.encode(body, config.jwt.secret);
                    res.end(token);             
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