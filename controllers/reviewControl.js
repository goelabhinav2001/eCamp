const express = require("express")
const Campground = require('../models/camp.js')
const ExpressError = require('../utils/ExpressError')
const wrapAsync = require('../utils/wrapAsync')
const router = express.Router({mergeParams:true});
const {reviewSchema} = require('../campgroundSchema');
const Review = require('../models/review')
const {isLoggedIn,isReviewOwner} = require('../middleware')

module.exports.createReview = async(req,res)=>{
    const review = await Review(req.body.review)
    const campground = await Campground.findById(req.params.id)
    campground.reviews.push(review)
    await campground.save()
    review.owner = req.user._id;
    await review.save()
    req.flash('success','Review added successfully!')
    res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.deleteOne({_id:reviewId})
    req.flash('success','Review deleted successfully!')
    res.redirect(`/campgrounds/${id}`)
}