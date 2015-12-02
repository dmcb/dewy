var express = require('express');
var router = express.Router();
var util = require('util');

router.post('/api/filters', function (req, res, next) {
  console.log(util.inspect(req.body, {showHidden: false, depth: null}));
  res.send();
});

module.exports = router;