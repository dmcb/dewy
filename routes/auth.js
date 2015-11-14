var express = require('express');
var router = express.Router();

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
    layout: 'splash'
  });
});

router.post('/signon', function(req, res, next) {
  req.session.email = req.body.email;
  res.send(req.session.email);
});

module.exports = router;
