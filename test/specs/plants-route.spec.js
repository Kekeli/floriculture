'use strict'

var request = require('supertest'),
  server = require('../../server');

/**
 * Plants tests
 */
describe('Plants', function() {
  describe('GET /plants', function() {

    it('should return a 200 response and utf-8', function(done) {
      request(server)
      .get('/plants')
      .set('Accept', 'application/json')
      .expect('Content-Type', /utf-8/)
      .expect(200, done);
    })
  });
});
