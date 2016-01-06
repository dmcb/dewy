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

  return newFilter;
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
    title: 'Aggregate CSS',
    choices: [
      'is on',
      'is not on'
    ],
    value: false
  },
  {
    title: 'Aggregate JS',
    choices: [
      'is on',
      'is not on'
    ],
    value: false
  },
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
    title: 'Caching for anonymous',
    choices: [
      'is on',
      'is not on'
    ],
    value: false
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
    title: 'Database file size',
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
    title: 'File size (private)',
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
    title: 'File size (db+private+public)',
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
    title: 'Module',
    choices: [
      'contains',
      'does not contain',
      'is',
      'is not',
      'starts with',
      'ends with'
    ],
    value: 'string',
    details: [
      'and is available',
      'and is enabled',
      'and is disabled'
    ]
  },
  {
    title: 'Modules',
    choices: [
      'are up-to-date',
      'are out-of-date'
    ],
    value: false
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
    title: 'PHP version',
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
    value: 'tag'
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
    value: 'string',
    details: [
      'and is available',
      'and is default',
      'and is enabled',
      'and is disabled'
    ]
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
  },
  {
    title: 'Variable',
    choices: [
      'contains',
      'does not contain',
      'is',
      'is not',
      'starts with',
      'ends with'
    ],
    value: 'string',
    details: [
      'and has a setting',
      'and is true',
      'and is false'
    ]
  }
]

filters = [
  {
    id: '1',
    title: 'In development',
    url: 'in-development',
    notifications: {
      appears: {
        enabled: false
      },
      disappears: {
        enabled: true
      },
      total: {
        enabled: true,
        choice: 'is greater than',
        value: 4
      }
    },
    operator: 'any',
    rules: [
      {
        field: 'Maintenance mode',
        choice: 'is on'
      },
      {
        field: 'Tag',
        choice: 'is',
        value: '1'
      }
    ]
  },
  {
    id: '2',
    title: 'Modules',
    children: [
      {
        id: '3',
        title: 'Views',
        url: 'views',
        notifications: {
          appears: {
            enabled: false
          },
          disappears: {
            enabled: false
          },
          total: {
            enabled: false,
          }
        },
        operator: 'all',
        rules: [
          {
            field: 'Module',
            choice: 'is',
            value: 'views',
            detail: 'and is available'
          },
          {
            field: 'Content type',
            choice: 'starts with',
            value: 'view_reference'
          }
        ]
      },
      {
        id: '4',
        title: 'Big webform sites',
        url: 'big-webform-sites',
        notifications: {
          appears: {
            enabled: true
          },
          disappears: {
            enabled: false
          },
          total: {
            enabled: false,
          }
        },
        operator: 'all',
        rules: [
          {
            field: 'Module',
            choice: 'contains',
            value: 'webform',
            detail: 'and is enabled'
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
    id: '5',
    title: 'Really long title to serve as an edge case for the design',
    url: 'really-long-title-to-serve-as-an-edge-case-for-the-design',
    notifications: {
      appears: {
        enabled: false
      },
      disappears: {
        enabled: false
      },
      total: {
        enabled: false,
      }
    },
  },
  {
    id: '6',
    title: 'Anotherreallylongtitlewithoutbreaksthanksjerk',
    url: 'anotherreallylongtitlewithoutbreaksthanksjerk',
    notifications: {
      appears: {
        enabled: false
      },
      disappears: {
        enabled: false
      },
      total: {
        enabled: false,
      }
    },
  }
]

newFilter = {
  notifications: {
    appears: {
      enabled: false
    },
    disappears: {
      enabled: false
    },
    total: {
      enabled: false
    }
  },
  operator: 'any',
  rules: [{
    field: 'Base URL',
    choice: 'contains',
  }]
}

operators = [
  'any',
  'all',
  'none'
];
