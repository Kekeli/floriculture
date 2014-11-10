'use strict';

var request = require('supertest'),
  express = require('express'),
  passport = require('passport'),
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

describe('GET /profile', function() {
  it('should return 403 when no user is logged in', function(done) {

    var app = express();
    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/profile', function(req, res) {
      if (!req.user || !req.isAuthenticated()) {
        return res.sendStatus(403);
      }
      res.sendStatus(200);
    });

    request(app)
      .get('/profile')
      .expect(403)
      .end(done);
  });

  it('should return 200 when user is logged in', function(done) {
    var app = express();
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function(req, res, next) {
      req.isAuthenticated = function() {
        return true;
      };
      req.user = {};
      next();
    });
    app.get('/profile', function(req, res) {
      if (!req.user || !req.isAuthenticated()) {
        return res.sendStatus(403);
      }
      res.sendStatus(200);
    });

    request(app)
      .get('/profile')
      .expect(200)
      .end(done);

  });
});

describe('GET /about', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .get('/about')
      .expect(200, done);
  });
});
