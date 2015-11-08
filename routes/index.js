var express = require('express');
var router = express.Router();

router.get('/sites', function(req, res, next) {
  sites = [
    {
      title: "Schulich",
      base_url: "schulich.ucalgary.ca",
      complexity: 3.53,
      size: 10,
      activity: 4.42,
      health: 1
    },
    {
      title: "Haskayne",
      base_url: "haskayne.ucalgary.ca",
      complexity: 1,
      size: 4.17,
      activity: 7.35,
      health: 6.4
    },
    {
      title: "Science",
      base_url: "ucalgary.ca/science",
      complexity: 1,
      size: 6.12,
      activity: 4.92,
      health: 4.55
    }
  ];
  filters = [
    {
      title: "In development",
      notifications: true
    },
    {
      title: "Modules",
      children: [
        {
          title: "Views"
        },
        {
          title: "Big webform sites",
          notifications: true
        }
      ]
    },
    {
      title: "Really long title to serve as an edge case for the design",
      notifications: true
    },
    {
      title: "Anotherreallylongtitlewithoutbreaksthanksjerk"
    }
  ]
  res.render('sites', { 
    title: 'Dewy',
    sites: sites,
    filters: filters,
    current_filter: 'Views',
    helpers: {
      dots: function(number, dot) {
        var dots = '';
        for (var i=0; i<number; i++)
          dots += dot.fn(i);
        return dots;
      }
    }
  });
});

router.get('/filter', function(req, res, next) {
  res.render('filter', { 
    title: 'Dewy'
  });
});

module.exports = router;
