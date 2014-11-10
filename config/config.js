'use strict';

var production = {
  app: {
    name: 'Rutger\'s Floriculture Greenhouse'
  },
  database: {
    url : 'mongodb://localhost/greenhouse'
   }
};
var development = {
  app: {
    name: 'Floriculture - Development'
  },
  database: {
    url : 'mongodb://localhost/greenhouse'
  },
  debug: 'true',
};
var test = {
  app: {
    name: 'Floriculture - Test'
  },
  database: {
    url : 'mongodb://localhost/greenhouse_test'
  }
};

module.exports = function() {
  switch (process.env.NODE_ENV) {
    case 'production':
      return production;
    case 'test':
      return test;
    case 'development':
    default:
      return development;
  }
};
