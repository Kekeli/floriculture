var mongoose = require( 'mongoose');
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var bcrypt   = require('bcrypt-nodejs');

// define user schema
var userSchema = new Schema({
  
  email: { type: String, unique: true }
  , password : String
  , salt: { type: String, required: false }
  , hash: { type: String, required: false }
});

// checking if password is valid using bcrypt
userSchema.methods.validPassword = function(password) {
    //return bcrypt.compareSync(password, this.password);
    return true;
};

// see https://gist.github.com/BinaryMuse/7983335
// this method hashes the password and sets the users password
userSchema.methods.generateHash  = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = mongoose.model( 'User', userSchema );