'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;  // jshint ignore:line

// specify the schema for each member of the plants collection
var plantSchema = new Schema({
    // _id   : ObjectId,
    Family : String,
    Genus : String,
    Species : String,
    Subspecies : String,
    Variety : String,
    Common_Name : {type: String, required: false},
    Section  : String,
    Bench : String,
    Hanging : String,

    origin : String,
    accession_no : Number,
    comments    : String,
    image_url   : String,
    location    : {
      lat : Number,
      lng : Number
    },

    // note can get created_on from ObjectId itself
    created_by  : String,
    updated_at  : Date,
    updated_by  : String
});

var BASE_IMAGE_URI = 'uploads';

// utility methods
plantSchema.methods.getBotanicalName = function getBotanicalName() {
  return this.Family + ' ' + this.Genus;
};

plantSchema.methods.getImageName = function getImageName() {
  return this.Genus + '_' + this.Species + '.png';
};

plantSchema.methods.getImageUrl = function getImageUrl() {
  return BASE_IMAGE_URI + '/' + this.Family + '/' + this.getImageName();
};

plantSchema.methods.getLocation = function getLocation() {
  var loc = 'Section: ' + this.Section + ', Bench ' + this.Bench;
  if (this.Hanging) {
    loc = loc + ' (Hanging)';
  }
  return loc;
};

module.exports = mongoose.model('Plant', plantSchema);
