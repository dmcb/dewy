var express = require('express');
var router = express.Router();

router.get('/sites', function(req, res, next) {
  if (!req.user) {
    req.flash('error', 'You must sign on to view this page.');
    return res.redirect('/signon');
  }
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
    message: req.flash('message')[0],
    user: req.user,
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
  if (!req.user) {
    req.flash('error', 'You must sign on to view this page.');
    return res.redirect('/signon');
  }
  operators = ['any','all','none'];
  fields = [
    {
      title: 'Base URL',
      choices: [
        {title: 'contains'},
        {title: 'does not contain'},
        {title: 'is'},
        {title: 'is not'},
        {title: 'starts with'},
        {title: 'ends with'}
      ]
    },
    {
      title: 'Broken links',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Content type',
      choices: [
        {title: 'contains'},
        {title: 'does not contain'},
        {title: 'is'},
        {title: 'is not'},
        {title: 'starts with'},
        {title: 'ends with'}
      ]
    },
    {
      title: 'Database',
      choices: [
        {title: 'is pending updates'},
        {title: 'is updated'}
      ]
    },
    {
      title: 'Date added to Dewy',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is after'},
        {title: 'is before'},
        {title: 'is in the last'},
        {title: 'is not in the last'}
      ]
    },
    {
      title: 'Date last accessed',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is after'},
        {title: 'is before'},
        {title: 'is in the last'},
        {title: 'is not in the last'}
      ]
    },
    {
      title: 'Date last edited',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is after'},
        {title: 'is before'},
        {title: 'is in the last'},
        {title: 'is not in the last'}
      ]
    },
    {
      title: 'Drupal core',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'File size (private)',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'File size (public)',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'File size (total)',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Maintenance mode',
      choices: [
        {title: 'is on'},
        {title: 'is not on'}
      ]
    },
    {
      title: 'Module name',
      choices: [
        {title: 'contains'},
        {title: 'does not contain'},
        {title: 'is'},
        {title: 'is not'},
        {title: 'starts with'},
        {title: 'ends with'}
      ]
    },
    {
      title: 'Number of content types',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Number of files (private)',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Number of files (public)',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Number of files (total)',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Number of hits in past day',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Number of hits in past week',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Number of hits in past month',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Number of modules',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Number of nodes',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Number of roles',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Number of themes',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Number of users',
      choices: [
        {title: 'is'},
        {title: 'is not'},
        {title: 'is greater than'},
        {title: 'is less than'},
        {title: 'is greater than or equal to'},
        {title: 'is less than or equal to'}
      ]
    },
    {
      title: 'Role',
      choices: [
        {title: 'contains'},
        {title: 'does not contain'},
        {title: 'is'},
        {title: 'is not'},
        {title: 'starts with'},
        {title: 'ends with'}
      ]
    },
    {
      title: 'Tag',
      choices: [
        {title: 'is'},
        {title: 'is not'}
      ]
    },
    {
      title: 'Text',
      choices: [
        {title: 'contains'},
        {title: 'does not contain'},
        {title: 'is'},
        {title: 'is not'},
        {title: 'starts with'},
        {title: 'ends with'}
      ]
    },
    {
      title: 'Theme',
      choices: [
        {title: 'contains'},
        {title: 'does not contain'},
        {title: 'is'},
        {title: 'is not'},
        {title: 'starts with'},
        {title: 'ends with'}
      ]
    },
    {
      title: 'Title',
      choices: [
        {title: 'contains'},
        {title: 'does not contain'},
        {title: 'is'},
        {title: 'is not'},
        {title: 'starts with'},
        {title: 'ends with'}
      ]
    },
    {
      title: 'User email address',
      choices: [
        {title: 'contains'},
        {title: 'does not contain'},
        {title: 'is'},
        {title: 'is not'},
        {title: 'starts with'},
        {title: 'ends with'}
      ]
    },
    {
      title: 'User name',
      choices: [
        {title: 'contains'},
        {title: 'does not contain'},
        {title: 'is'},
        {title: 'is not'},
        {title: 'starts with'},
        {title: 'ends with'}
      ]
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
          },
          {
            operator: 'none',
            rules: [
              {
                field: 'User email address',
                choice: 'blah'
              }
            ]
          },
          {
            field: 'User email address',
            choice: 'blah'
          },
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
