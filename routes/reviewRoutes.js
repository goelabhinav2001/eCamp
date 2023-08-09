const express = require("express")
const Campground = require('../models/camp.js')
const ExpressError = require('../utils/ExpressError')
const wrapAsync = require('../utils/wrapAsync')
const router = express.Router({mergeParams:true});
const {reviewSchema} = require('../campgroundSchema');
const Review = require('../models/review')
const {isLoggedIn,isReviewOwner, validateReview} = require('../middleware')
const reviews = require('../controllers/reviewControl')



router.post('/',isLoggedIn,validateReview,wrapAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewOwner,wrapAsync(reviews.deleteReview))

module.exports = router 