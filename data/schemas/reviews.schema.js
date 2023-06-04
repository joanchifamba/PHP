const mongoose = require("mongoose");

const reviewsSchema = mongoose.Schema({
    name:{
        type:String,
        required : true
    },
    title:{
        type:String,
        required : true
    },
   

});

module.exports = reviewsSchema

