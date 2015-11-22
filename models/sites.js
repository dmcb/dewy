exports.getByFilter = function(user, filter) {
  // Dummy function for now, will eventually pull from persistence layer
  return sites;
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
