const mongoose = require('mongoose')
const {Schema} = mongoose;
const User = require('./user')

const reviewSchema = new Schema({
    rating:{
        type:Number,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    owner:{type:Schema.Types.ObjectId,ref:'User'}
})

const Review = new mongoose.model('Review',reviewSchema)

module.exports = Review;