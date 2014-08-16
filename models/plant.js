var mongoose = require( 'mongoose');
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

// specify the schema for each member of the plants collection
var plantSchema = new Schema({
    _id   : ObjectId,
    common_name : { type: String, required: true},
    botanical_name	: String,
    plant_family : String,
    origin : String,
    accession_nbr : Number,
    comments  	: String,
    image_url 	: String,
    location	: {
    	lat : Number,
    	lng : Number
    },
   
    // note can get created_on from ObjectId itself
    created_by 	: String,
    updated_at	: Date,
    updated_by	: String
});

module.exports = mongoose.model( 'Plant', plantSchema );
