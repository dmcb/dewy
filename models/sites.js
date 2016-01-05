exports.get = function(user, siteId) {
  for (var i=0; i<sites.length; i++) {
    if (sites[i].id == siteId) {
      return sites[i];
    }
  }
}

exports.getAll = function(user, filterId) {
  // Dummy function for now, will eventually pull from persistence layer
  return sitesList;
}

sites = [
  {
    id: 1,
    tags: ['awesome', 'development'],
  },
  {
    id: 2,
    tags: ['awesome'],
  },
  {
    id: 3,
    tags: [],
  }
];

sitesList = [
  {
    id: 1,
    title: 'Photography Blog',
    base_url: 'photographybyderek.ca/blog',
    complexity: 3.53,
    size: 10,
    activity: 4.42,
    health: 1
  },
  {
    id: 2,
    title: 'Derek McBurney',
    base_url: 'derekmcburney.com',
    complexity: 1,
    size: 4.17,
    activity: 7.35,
    health: 6.4
  },
  {
    id: 3,
    title: 'my world, my choice!',
    base_url: 'myworldmychoice.org',
    complexity: 1,
    size: 6.12,
    activity: 4.92,
    health: 4.55
  }
];