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

describe('GET /logout', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .get('/logout')
      .end(function(err) {
        if (err) { return done(err); }
        // Logging out should have redirected you...
        request(server)
          .get('/')
          .end(function(err) {
            if (err) { return done(err); }
            // res.text.should.not.include('Testing Tester');
            // res.text.should.include('login');
            done();
          });
      });
  });
});

describe('GET /signup', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .get('/signup')
      .expect(200, done);
  });
});

// describe('GET /profile', function() {
//   it('should return 200 OK', function(done) {
//     request(server)
//       .get('/profile')
//       .expect(200, done);
//   });
// });

describe('GET /about', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .get('/about')
      .expect(200, done);
  });
});
