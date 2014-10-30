'use strict';

var request = require('supertest'),
  server = require('../../server');

describe('GET /', function() {
  it('can return a 200 response', function(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
});