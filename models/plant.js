var mongoose = require( 'mongoose');
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;


// specify the schema for each member of the plants collection
var plantSchema = new Schema({
    _id   : ObjectId,
    Family : String,
    Genus : String,
    Species : String,
    Subspecies : String,
    Variety : String,
    Common_Name : { type: String, required: false},
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

module.exports = mongoose.model( 'Plant', plantSchema );
