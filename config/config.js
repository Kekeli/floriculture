'use strict';

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL;

var production = {
  app: {
    name: 'Rutger\'s Floriculture Greenhouse'
  },
  database: {
    url : uristring || 'mongodb://localhost/greenhouse'
  }
};
var development = {
  app: {
    name: 'Floriculture - Development'
  },
  database: {
    url : uristring || 'mongodb://localhost/greenhouse'
  },
  debug: 'true',
};
var test = {
  app: {
    name: 'Floriculture - Test'
  },
  database: {
    url : uristring || 'mongodb://localhost/greenhouse_test'
  }
};

module.exports = function() {
  switch (process.env.NODE_ENV) {
    case 'production':
      return production;
    case 'test':
      return test;
    case 'development':
      return development;
    default:
      return development;
  }
};
