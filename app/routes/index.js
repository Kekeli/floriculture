// index.js
'use strict';

var mongoose = require('mongoose');
var paginate = require('paginate') ({
  mongoose : mongoose
});

var express = require('express'),
  router = express.Router(),
  passport = require('passport');

var util = require('util');
var fs = require('fs-extra');
var path = require('path');

// =====================================
// HOME PAGE (with login links) ========
// =====================================
router.get('/', function(req, res) {
  res.render('index', {
    title : 'Welcome',
    user : req.user
  });
});

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
router.get('/login', function(req, res) {

  // render the page and pass in any flash data if it exists
  res.render('login', {
    title : 'Please log on',
    user : req.user,
    message : req.flash('loginMessage')
  });
});

// process the login form
router.post('/login',
  passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  })
);

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/signup', function(req, res) {

  // render the page and pass in any flash data if it exists
  res.render('signup.ejs', {
    title : 'Sign up!',
    user : req.user,
    message: req.flash('signupMessage')
  });
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', {
    title : 'User Profile',
    user : req.user
  });
});

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// =====================================
// ABOUT ===============================
// =====================================
router.get('/about', function(req, res) {
  res.render('about', {
    title : 'About' ,
    user : req.user
  });
});

var Plant = require('../models/plant');

router.get('/plants', function(req, res, next) {

  Plant
  .find()
  .sort({Family:1})
  /*exported paginate */
  .paginate({page: req.query.page}, function(err, plants) {

    if (err) { return next(err); }

    res.render('plants', {
      title : 'Plant list',
      plants : plants,
      user : req.user
    });
  });
});

router.get('/plants/new', isLoggedIn, function(req, res) {
  res.render('new', {
    title : 'Add a plant!'
  });
});

router.get('/plants/edit/:id', isLoggedIn, function(req, res, next) {

  var id = req.params.id;
  console.log('Retrieving plant for edit: ' + id);

  Plant
  .findOne({_id: req.params.id}, function(err, plant) {
    if (err) { return next(err); }
    if (!plant) {
      return next(new NotFound('Plant not found'));
    }

    console.info('Plant %s', plant.getBotanicalName());
    res.render('edit', {

      locals: {p : plant, title : 'Edit the plant', user : req.user}
    });
  });
});

router.post('/plants', function(req, res, next) {

  // todo: hook up validator
  if (!req.body || !req.body.botanical_name) {
    return next(new Error('No data provided.'));
  }

  new Plant(req.body)
  .save(function(err, plant) {
    if (err) { return next(err); }
    if (!plant) { return next(new Error('Failed to save.')); }

    console.info('Added %s with id=%s', plant.getBotanicalName(), plant._id);

    res.redirect('/plants');
  });
});

// by clicking on plant's default image, display full plant info and image
router.get('/plants/:id', function(req, res, next) {

  var id = req.params.id;
  console.log('Retrieving plant: ' + id);

  Plant
  .findById(id, function(err, plant) {

    if (err) { return next(err); }
    if (!plant) { return next(new Error('Failed to find plant.')); }

    console.info('Found %s with id=%s', plant.getBotanicalName(), plant._id);

    res.render('plant', {
      title : 'Show me the plant!',
      plant : plant,
      current : req.params.id
    });
  });
});

// Update
router.put('/plants/:id', function(req, res, next) {

  Plant.findById(req.params.id, function(err, plant) {
    if (!plant) { return next(new NotFound('Plant not found')); }

    plant.Family = req.body.Family;
    plant.Genus = req.body.Genus;
    plant.Species = req.body.Species;
    plant.Common_Name = req.body.Common_Name;
    plant.Section = req.body.Section;
    plant.Bench = req.body.Bench;
    //plant.comments = req.body.comments;
    //plant.origin = req.body.origin;
    plant.image_url = req.body.image_url;
    plant.updated_at = Date.now();
    plant.save(function(err) {
      if (err) { return next(err); }

      res.redirect('/plants');
    });
  });
});

// delete works peachy!
// however, would be nice to have a confirmation msg
// and should mark as deleted in db rather than removed
router.get('/plants/destroy/:id', isLoggedIn, function(req, res, next) {

  console.log('in plants.destroy with id: ' + req.params.id);

  Plant.findById(req.params.id, function(err, plant) {

    plant.remove(function(err) {
      if (err) { return next(err); }

      res.redirect('/plants');
    });
  });
});

// =====================================
// UPLOADS =============================
// =====================================
router.get('/uploads', function(req, res) {
  res.render('uploads', {title: 'I love files!'});
});

router.post('/uploads', function(req, res, next) {

  if (req.body) {
    console.log(req.body);
    // todo: use family name for folder
    // below make subfolder as needed
  }

  if (req.files) {
    console.log(util.inspect(req.files));
    if (req.files.plantImage.size === 0) {
      return next(new Error('Please first select a file?'));
    }

    var subFolder =  './public/uploads/' + 'Family';
    var tmpPath = req.files.plantImage.path;
    fs.exists(tmpPath, function(exists) {
      if (exists) {

        // ensure the target folder exists
        fs.ensureDirSync(subFolder, function(err) {
          console.log(err)
        })

        var targetPath = subFolder + path.sep + req.files.plantImage.name;
        console.log(targetPath)
        fs.rename(tmpPath, targetPath, function(err) {
          if (err) { console.log(err) }

          fs.unlink(tmpPath, function() {
            if (err) { next(err); }
            res.send('File uploaded to: ' + targetPath +
              ' - ' + req.files.plantImage.size + ' bytes');
          });

        });
      } else {
        res.end('Bad request: uploaded file not found');
      }
    });
  }
});

module.exports = router

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
}

function NotFound(msg) {

  if (!(this instanceof NotFound)) {
    return new NotFound(msg);
  }

  this.name = 'NotFound';
  Error.call(this);
  this.message = msg;
  Error.captureStackTrace(this, NotFound);
}
