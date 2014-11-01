var mongoose = require('mongoose'),
  bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

// define user schema
var userSchema = new Schema({

  local : {
    email: {type: String, unique: true},
    password : String,
  }
});

// methods =====================================
// see https://gist.github.com/BinaryMuse/7983335
// this method hashes the password and sets the users password
userSchema.methods.generateHash  = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid using bcrypt
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
