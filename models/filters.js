exports.get = function(filters, url) {
  for (var i=0; i<filters.length; i++) {
    if (filters[i].url && filters[i].url == url) {
      return filters[i];
    }
    else if (filters[i].children) {
      result = this.get(filters[i].children, url);
      if (result) {
        return result;
      }
    }
  }
}

exports.getByUser = function(user) {
  // Dummy function for now, will eventually pull from persistence layer
  return filters;
}

exports.getFields = function() {
  // Dummy function for now, will eventually pull from persistence layer
  return fields;
}

exports.getOperators = function() {
  // Dummy function for now, will eventually pull from persistence layer
  return operators;
}

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

filters = [
  {
    title: 'In development',
    url: 'in-development',
    notifications: true,
    operator: 'any',
    rules: [
      {
        field: 'Maintenance mode',
        choice: 'is on'
      },
      {
        field: 'Tag',
        choice: 'are present',
        value: 'development'
      }
    ]
  },
  {
    title: 'Modules',
    children: [
      {
        title: 'Views',
        url: 'views',
        operator: 'all',
        rules: [
          {
            field: 'Module name',
            choice: 'is',
            value: 'views'
          },
          {
            field: 'Content type',
            choice: 'starts with',
            value: 'view_reference'
          }
        ]
      },
      {
        title: 'Big webform sites',
        url: 'big-webform-sites',
        notifications: true,
        operator: 'all',
        rules: [
          {
            field: 'Module name',
            choice: 'contains',
            value: 'webform'
          },
          {
            operator: 'any',
            rules: [
              {
                field: 'Number of hits in past month',
                choice: 'is greater than',
                value: 7000
              },
              {
                field: 'Number of nodes',
                choice: 'is greater than',
                value: 5000
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Really long title to serve as an edge case for the design',
    url: 'really-long-title-to-serve-as-an-edge-case-for-the-design',
    notifications: true
  },
  {
    title: 'Anotherreallylongtitlewithoutbreaksthanksjerk',
    url: 'anotherreallylongtitlewithoutbreaksthanksjerk',
  }
]

operators = ['any','all','none'];
