const Review = require('./models/review')
const Campground = require('./models/camp')
const {campgroundSchema,reviewSchema} = require('./campgroundSchema')
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req,res,next) =>{
   
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be Logged in.')
        return res.redirect('/login')  
    }
    next()
    
}
module.exports.validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(x => x.message).join(',')
        throw new ExpressError(msg,404);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(x => x.message).join(',')
        throw new ExpressError(msg,404);
    }
    else{
        next();
    }
}

module.exports.isOwner = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.owner.equals(req.user._id)){
           req.flash('error','You do not have permission to do that.')
           return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewOwner = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if(!review.owner.equals(req.user._id)){
       req.flash('error','You do not have permission to do that.')
       return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

