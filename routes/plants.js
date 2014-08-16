// plants.js
module.exports = function(app, passport) {
var mongoose = require( 'mongoose' );
var paginate = require('paginate') ({
  mongoose : mongoose
});

var Plant    = require('../models/plant' );

 app.get('/plants', isLoggedIn, function(req, res, next) {
                
  Plant
  .find()
  .paginate({page: req.query.page },  function ( err, plants ){
      if( err ) return next( err );
      
      res.render( 'plants', {
          title : 'The DBL Plants',
          plants : plants,
          user : req.user 
      });
    });
});

  app.get('/plants/new', function ( req, res ){
    res.render('new', {
      title : 'Add a plant!' 
    });
  });

app.get('/plants/edit/:id', function( req, res, next ){

  var id = req.params.id;
  console.log('Retrieving plant for edit: ' + id);

  Plant.
    findOne( {_id: req.params.id }, function ( err, plant ){
      if( err ) return next( err );
      if (!plant) return next(new NotFound('Plant not found'));

      console.info('Plant %s', plant.botanical_name);
      res.render( 'edit', {
        
          locals: { p : plant, title  : 'Edit the plant', user : req.user  }
    });
  });
});


app.post('/plants',  function ( req, res, next ){
  
  // todo: hook up validator
  if (!req.body || !req.body.botanical_name) 
    return next(new Error('No data provided.'));

  new Plant(req.body)
  .save( function ( err, plant, count ){
    if( err ) return next( err );
    if (!plant) return next(new Error('Failed to save.'));

    console.info('Added %s with id=%s', plant.common_name, plant._id);

    res.redirect( '/plants' );
  });
});

// by clicking on plant's botanical name, display full plant info and image
app.get('/plants/:id', function( req, res, next ){
  
  var id = req.params.id;
  console.log('Retrieving plant: ' + id);

  Plant
  .findById( id, function ( err, plant ){
    
      if( err ) return next( err );
      if (!plant) return next(new Error('Failed to find plant.'));

      console.info('Found %s with id=%s', plant.botanical_name, plant._id);

      res.render( 'plant', {
        title : 'Show me the plant!',
        plant : plant,
        current : req.params.id
      });
  });
});

// Update
app.put('/plants/:id', function( req, res, next ){

  Plant.findById( req.params.id, function ( err, plant ){
    if (!plant) return next(new NotFound('Plant not found'));
    
    plant.botanical_name = req.body.botanical_name;
    plant.common_name = req.body.common_name;
    plant.comments = req.body.comments;
    plant.origin = req.body.origin;
    plant.image_url = req.body.image_url;
    plant.updated_at = Date.now();
    plant.save( function ( err ){
      if( err ) return next( err );

      res.redirect( '/plants' );
    });
  });
});

// delete works peachy!
// however, would be nice to have a confirmation msg
// and should mark as deleted in db rather than removed
app.get('/plants/destroy/:id', function ( req, res, next ){

  console.log('in plants.destroy with id: '+ req.params.id);

  Plant.findById( req.params.id, function ( err, plant ){
    
    plant.remove( function ( err, plant, count ){
      if( err ) return next( err );

      res.redirect( '/plants' );
    });
  });
});

function validate(plant) {
  var v = new Validator()
    , errors = []
    ;

  v.error = function(msg) {
    errors.push(msg);
  };

  v.check(plant.botanical_name, 'Please enter the botanical name').len(1, 50);
  v.check(plant.common_name, 'Please enter the common name').len(1, 100);
  v.check(plant.origin, 'Please enter the origin or locale(s)').len(1, 100);

  return errors;
}

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
                return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
}
