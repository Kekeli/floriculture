var mongoose = require( 'mongoose');  

// connect to database
module.exports = {

  url: 'mongodb://localhost/greenhouse',
 
  // initialize DB
  startup: function() {

    // now connect to the greenhouse db
    mongoose.connect( 'mongodb://localhost/greenhouse' );

    var db = mongoose.connection;
    // Check connection to mongoDB
    db.on('error', console.error.bind(console, 'DB connection error:'));
    db.once('open', function() {
      console.log('We have connected to mongodb for the greenhouse');
    }); 
  },

  // disconnect from database
  closeDB: function() {
    mongoose.disconnect();
  }
}
