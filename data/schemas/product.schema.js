const mongoose = require("mongoose");
const reviewsSchema = require("./reviews.schema");
const { Double } = require("mongodb");
productSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    company: {
        type: String,
        required : true
    },
    companyLogo: {
        type: String,
        required : true
    },
    reviews: {
        type:[reviewsSchema],
        required:false,
        default:[]
    }

});


module.exports = productSchema

