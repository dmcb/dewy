var express = require('express');
var router = express.Router();

router.get('/filter/:filter?', function(req, res, next) {
  if (!req.user) {
    req.flash('error', 'You must sign on to view this page.');
    return res.redirect('/signon');
  }
  res.render();
});

router.get('/sites/:filter?', function(req, res, next) {
  if (!req.user) {
    req.flash('error', 'You must sign on to view this page.');
    return res.redirect('/signon');
  }
  res.render();
});

module.exports = router;