const express = require("express")
const Campground = require('../models/camp.js')
const ExpressError = require('../utils/ExpressError')
const wrapAsync = require('../utils/wrapAsync')
const flash = require('connect-flash');
const {isLoggedIn,isOwner,validateCampground} = require('../middleware');
const { cloudinary } = require("../cloudinary/index.js");
const mapbox_token = process.env.MAPBOX_TOKEN;
const mapbox_geoCoder = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mapbox_geoCoder({accessToken:mapbox_token})

module.exports.allCampgrounds = async (req,res)=>{
   
        const campgrounds = await Campground.find({})
        res.render("campgrounds/index",{campgrounds})
    }

module.exports.newCampgroundForm = async(req,res)=>{
    res.render('campgrounds/create')
}

module.exports.createNewCampground = async(req,res,next)=>{
    
    const{campground} = req.body 

    const geoCodeDetails = await geoCoder.forwardGeocode({
        query: campground.location,
        limit:1
    }).send()
    
    campground.geometry = geoCodeDetails.body.features[0].geometry
    const newGround = await new Campground(campground)
    
    for(let image of req.files){
        newGround.images.push({
            url: image.path,
            filename: image.filename
        })
    }
    
    newGround.owner = req.user._id;
   
    await newGround.save()
    req.flash('success','Campground successfully added!')
    res.redirect(`/campgrounds/${newGround._id}`)
}

module.exports.showCampground = async(req,res)=>{
   
    const {id} = req.params
    
    const campground =  await Campground.findOne({_id:id}).populate({
        path:'reviews',
         populate:{path:'owner'}
    }).populate('owner')
    
    if(!campground){
        req.flash('error','Cannot find that campground.')
       return  res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground:campground})
}

module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params
   
   
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
   
    
    for(let image of req.files){
        campground.images.push({
            url: image.path,
            filename: image.filename
        })
    }
    await campground.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Campground edited successfully!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Campground deleted successfully!')
    res.redirect("/campgrounds")
}

module.exports.updateCampgroundForm = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findOne({_id:id})
    if(!campground){
        req.flash('error','Cannot find that campground.')
       return  res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}