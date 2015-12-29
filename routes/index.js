var express = require('express');
var router = express.Router();

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
  res.render('index', {
    title: 'Dewy | Take back Drupal with powerful reporting, queries and notifications',
    layout: 'site'
  });
});

module.exports = router;