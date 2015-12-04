var express = require('express');
var router = express.Router();
var util = require('util');
var filters = require('../models/filters');
var sites = require('../models/sites');

router.get('/api/1.0/fields', function (req, res, next) {
  res.send(filters.getFields());
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

router.get('/api/1.0/operators', function (req, res, next) {
  res.send(filters.getOperators());
});

router.get('/api/1.0/sites/:filter?', function (req, res, next) {
  res.send(sites.getAll(null, req.params.filter));
});

module.exports = router;