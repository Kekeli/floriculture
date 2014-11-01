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

describe('GET /login', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .get('/signup')
      .expect(200, done);
  });
});
