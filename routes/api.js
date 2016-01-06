var express = require('express');
var router = express.Router();
var util = require('util');
var filters = require('../models/filters');
var sites = require('../models/sites');
var tags = require('../models/tags');

router.get('/api/1.0/fields', function (req, res, next) {
  res.send(filters.getFields());
});

router.delete('/api/1.0/filters/:filter', function (req, res, next) {
  console.log(util.inspect(req.body, {showHidden: false, depth: null}));
  res.send();
});

router.get('/api/1.0/filters', function (req, res, next) {
  res.send(filters.getAll(null));
});

router.get('/api/1.0/filters/:filter', function (req, res, next) {
  res.send(filters.get(null, req.params.filter));
});

router.post('/api/1.0/filters', function (req, res, next) {
  console.log(util.inspect(req.body, {showHidden: false, depth: null}));
  res.send();
});

router.put('/api/1.0/filters/:filter', function (req, res, next) {
  console.log(util.inspect(req.body, {showHidden: false, depth: null}));
  res.send();
});

router.get('/api/1.0/operators', function (req, res, next) {
  res.send(filters.getOperators());
});

router.get('/api/1.0/sites/:site?', function (req, res, next) {
  res.send(sites.get(null, req.params.site));
});

router.put('/api/1.0/sites/:site?', function (req, res, next) {
  console.log(util.inspect(req.body, {showHidden: false, depth: null}));
  res.send(sites.get(null, req.params.site));
});

router.get('/api/1.0/sites/_filter/:filter?', function (req, res, next) {
  res.send(sites.getAll(null, req.params.filter));
});

router.get('/api/1.0/tags', function (req, res, next) {
  res.send(tags.getAll(null));
});

router.post('/api/1.0/users', function (req, res, next) {
  console.log(util.inspect(req.body, {showHidden: false, depth: null}));
  res.send();
});

module.exports = router;