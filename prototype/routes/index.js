var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dewy' });
});

router.get('/filter', function(req, res, next) {
  res.render('filter', { title: 'Dewy' });
});

module.exports = router;
