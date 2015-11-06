var express = require('express');
var router = express.Router();

router.get('/sites', function(req, res, next) {
  res.render('sites', { title: 'Dewy' });
});

router.get('/filter', function(req, res, next) {
  res.render('filter', { title: 'Dewy' });
});

module.exports = router;
