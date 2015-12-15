exports.getAll = function(user, filter) {
  // Dummy function for now, will eventually pull from persistence layer
  return sites;
}

sites = [
  {
    title: 'Photography Blog',
    base_url: 'photographybyderek.ca/blog',
    complexity: 3.53,
    size: 10,
    activity: 4.42,
    health: 1
  },
  {
    title: 'Derek McBurney',
    base_url: 'derekmcburney.com',
    complexity: 1,
    size: 4.17,
    activity: 7.35,
    health: 6.4
  },
  {
    title: 'my world, my choice!',
    base_url: 'myworldmychoice.org',
    complexity: 1,
    size: 6.12,
    activity: 4.92,
    health: 4.55
  }
];
