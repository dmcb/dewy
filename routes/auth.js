var express = require('express');
var router = express.Router();
var passport = require('passport');

// router.get('/signon/example',
//   passport.authenticate('oauth2'));

// router.get('/signon/example/callback',
//   passport.authenticate('oauth2', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

router.get('/signon', function(req, res, next) {
  res.render('signon', { 
    title: 'Dewy',
    layout: 'splash',
    message: req.flash('message')[0]
  });
});

router.post('/signon', passport.authenticate('local', { failureRedirect: '/signon', failureFlash: true }), function (req, res, next) {
  req.flash('message', 'Welcome back ' + req.user.username + '.');
  res.redirect('/sites');
});

// Logout the user, then redirect to the home page.
router.get('/signoff', function(req, res) {
  req.logout();
  req.flash('message', 'You have successfully signed off.');
  res.redirect('/signon');
});

module.exports = router;
