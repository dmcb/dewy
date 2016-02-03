var express = require('express');
var router = express.Router();
var config = require('../config');
var forge = require("node-forge");

router.get('/filter/:filter?', function(req, res, next) {
    if (!req.user) {
        req.flash('message', 'You must sign on to view this page.');
        return res.redirect('/signon');
    }
    res.render();
});

router.get('/sites/:filter?', function(req, res, next) {
    if (!req.user) {
        req.flash('message', 'You must sign on to view this page.');
        return res.redirect('/signon');
    }
    res.render();
});

router.get('/', function(req, res, next) {
    res.render('index', { 
        title: 'Dewy | Take back Drupal with powerful reporting, queries and notifications',
        layout: 'site'
    });
});

router.post('/', function(req, res, next) {
    
    // Package signup information into JSON to send to API
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var request = require('request');
    request({
        uri: 'http://api.dewy.io/1.0/users',
        method: 'POST',
        form: {username: username, email: email, password: password}
    }, function(error, response, body) {
        object = JSON.parse(body);
        if (object['status'] == "error") {
            res.render('index', {
                title: 'Dewy | Take back Drupal with powerful reporting, queries and notifications',
                layout: 'site',
                message: object.message,
                username: username,
                email: email
            });
        }
        else {
            var authorization = new Buffer(config.client.client_id + ':' + config.client.client_secret).toString('base64');
            var password = forge.md.sha1.create().update(password).digest().toHex()
            request({
                headers: {
                    'Authorization': 'Basic ' + authorization
                },
                uri: 'http://api.dewy.io/1.0/oauth/token',
                method: 'POST',
                form: "grant_type=password&username=derek&password=" + password
            }, function(error, response, body) {
                console.log(body);
            });
        }
    });
});

module.exports = router;