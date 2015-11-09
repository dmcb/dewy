var express = require('express');
var router = express.Router();

router.get('/sites', function(req, res, next) {
  sites = [
    {
      title: 'Schulich',
      base_url: 'schulich.ucalgary.ca',
      complexity: 3.53,
      size: 10,
      activity: 4.42,
      health: 1
    },
    {
      title: 'Haskayne',
      base_url: 'haskayne.ucalgary.ca',
      complexity: 1,
      size: 4.17,
      activity: 7.35,
      health: 6.4
    },
    {
      title: 'Science',
      base_url: 'ucalgary.ca/science',
      complexity: 1,
      size: 6.12,
      activity: 4.92,
      health: 4.55
    }
  ];
  filters = [
    {
      title: 'In development',
      notifications: true
    },
    {
      title: 'Modules',
      children: [
        {
          title: 'Views'
        },
        {
          title: 'Big webform sites',
          notifications: true
        }
      ]
    },
    {
      title: 'Really long title to serve as an edge case for the design',
      notifications: true
    },
    {
      title: 'Anotherreallylongtitlewithoutbreaksthanksjerk'
    }
  ]
  res.render('sites', { 
    title: 'Dewy',
    sites: sites,
    filters: filters,
    current_filter: '',
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
  operators = ['any','all','none'];
  fields = [
    {
      title: 'Base URL',
      choices: [
        'contains',
        'does not contain',
        'is',
        'is not',
        'starts with',
        'ends with'
      ]
    },
    {
      title: 'Broken links',
      choices: {

      }
    },
    {
      title: 'Content type',
      choices: {

      }
    },
    {
      title: 'Database',
      choices: {

      }
    },
    {
      title: 'Date added to Dewy',
      choices: {

      }
    },
    {
      title: 'Date last accessed',
      choices: {

      }
    },
    {
      title: 'Date last edited',
      choices: {

      }
    },
    {
      title: 'Drupal core',
      choices: {

      }
    },
    {
      title: 'File size (private)',
      choices: {

      }
    },
    {
      title: 'File size (public)',
      choices: {

      }
    },
    {
      title: 'File size (total)',
      choices: {

      }
    },
    {
      title: 'Maintenance mode',
      choices: {

      }
    },
    {
      title: 'Module name',
      choices: {

      }
    },
    {
      title: 'Number of content types',
      choices: {

      }
    },
    {
      title: 'Number of files (private)',
      choices: {

      }
    },
    {
      title: 'Number of files (public)',
      choices: {

      }
    },
    {
      title: 'Number of files (total)',
      choices: {

      }
    },
    {
      title: 'Number of hits in past day',
      choices: {

      }
    },
    {
      title: 'Number of hits in past week',
      choices: {

      }
    },
    {
      title: 'Number of hits in past month',
      choices: {

      }
    },
    {
      title: 'Number of modules',
      choices: {

      }
    },
    {
      title: 'Number of nodes',
      choices: {

      }
    },
    {
      title: 'Number of roles',
      choices: {

      }
    },
    {
      title: 'Number of themes',
      choices: {

      }
    },
    {
      title: 'Number of users',
      choices: {

      }
    },
    {
      title: 'Role',
      choices: {

      }
    },
    {
      title: 'Tag',
      choices: {

      }
    },
    {
      title: 'Text',
      choices: {

      }
    },
    {
      title: 'Theme',
      choices: {

      }
    },
    {
      title: 'Title',
      choices: {

      }
    },
    {
      title: 'User email address',
      choices: {

      }
    },
    {
      title: 'User name',
      choices: {

      }
    }
  ]
  filter = {
    operator: 'any',
    rules: [
      {
        field: 'Broken links',
        choice: 'is greater than or equal to'
      },
      {
        field: 'Content type',
        choice: 'starts with'
      },
      {
        operator: 'all',
        rules: [
          {
            field: 'Maintenance mode',
            choice: 'is on'
          },
          {
            field: 'Tag',
            choice: 'are present'
          }
        ]
      }
    ]
  }
  res.render('filter', { 
    title: 'Dewy',
    fields: fields,
    filter: filter,
    current_filter: 'In development'
  });
});

module.exports = router;
