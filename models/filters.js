exports.get = function(user, url, filterSet) {
  filterSet = typeof filterSet !== 'undefined' ? filterSet : filters;
  // Comb through filters to get matching one
  for (var i=0; i<filterSet.length; i++) {
    if (filterSet[i].url && filterSet[i].url == url) {
      return filterSet[i];
    }
    else if (filterSet[i].children) {
      // Comb through children recursively until a match is made
      result = this.get(null, url, filterSet[i].children);
      if (result) {
        return result;
      }
    }
  }
}

exports.getAll = function(user) {
  // Dummy function for now, will eventually pull from persistence layer
  return filters;
}

exports.getChoicesByField = function(fields, field) {
  for (var i=0; i<fields.length; i++) {
    if (fields[i].title == field) {
      return fields[i].choices;
    }
  }
}

exports.getFields = function() {
  // Dummy function for now, will eventually pull from persistence layer
  return fields;
}

exports.getOperators = function() {
  // Dummy function for now, will eventually pull from persistence layer
  return operators;
}

exports.getValueByField = function(fields, field) {
  for (var i=0; i<fields.length; i++) {
    if (fields[i].title == field) {
      return fields[i].value;
    }
  }
}

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
    ],
    value: 'string'
  },
  {
    title: 'Content type',
    choices: [
      'contains',
      'does not contain',
      'is',
      'is not',
      'starts with',
      'ends with'
    ],
    value: 'string'
  },
  {
    title: 'Database',
    choices: [
      'is pending updates',
      'is updated'
    ],
    value: false
  },
  {
    title: 'Date added to Dewy',
    choices: [
      'is',
      'is not',
      'is after',
      'is before',
      'is in the last',
      'is not in the last'
    ],
    value: 'date'
  },
  {
    title: 'Date last accessed',
    choices: [
      'is',
      'is not',
      'is after',
      'is before',
      'is in the last',
      'is not in the last'
    ],
    value: 'date'
  },
  {
    title: 'Date last edited',
    choices: [
      'is',
      'is not',
      'is after',
      'is before',
      'is in the last',
      'is not in the last'
    ],
    value: 'date'
  },
  {
    title: 'Drupal core',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'number'
  },
  {
    title: 'File size (private)',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'number'
  },
  {
    title: 'File size (public)',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'File size (total)',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Maintenance mode',
    choices: [
      'is on',
      'is not on'
    ],
    value: false
  },
  {
    title: 'Module name',
    choices: [
      'contains',
      'does not contain',
      'is',
      'is not',
      'starts with',
      'ends with'
    ],
    value: 'string'
  },
  {
    title: 'Number of broken links',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of content types',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of files (private)',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of files (public)',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of files (total)',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of hits in past day',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of hits in past week',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of hits in past month',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of modules',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of nodes',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of roles',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of themes',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Number of users',
    choices: [
      'is',
      'is not',
      'is greater than',
      'is less than',
      'is greater than or equal to',
      'is less than or equal to'
    ],
    value: 'integer'
  },
  {
    title: 'Role',
    choices: [
      'contains',
      'does not contain',
      'is',
      'is not',
      'starts with',
      'ends with'
    ],
    value: 'string'
  },
  {
    title: 'Tag',
    choices: [
      'is',
      'is not'
    ],
    value: 'string'
  },
  {
    title: 'Text',
    choices: [
      'contains',
      'does not contain',
      'is',
      'is not',
      'starts with',
      'ends with'
    ],
    value: 'string'
  },
  {
    title: 'Theme',
    choices: [
      'contains',
      'does not contain',
      'is',
      'is not',
      'starts with',
      'ends with'
    ],
    value: 'string'
  },
  {
    title: 'Title',
    choices: [
      'contains',
      'does not contain',
      'is',
      'is not',
      'starts with',
      'ends with'
    ],
    value: 'string'
  },
  {
    title: 'User email address',
    choices: [
      'contains',
      'does not contain',
      'is',
      'is not',
      'starts with',
      'ends with'
    ],
    value: 'string'
  },
  {
    title: 'User name',
    choices: [
      'contains',
      'does not contain',
      'is',
      'is not',
      'starts with',
      'ends with'
    ],
    value: 'string'
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
        choice: 'is',
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

operators = [
  'any',
  'all',
  'none'
];
