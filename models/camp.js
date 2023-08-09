const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require('./review')
const User = require('./user')

const imageSchema = new Schema({
    
        
            url: String,
            filename:String
        
    
})

imageSchema.virtual('modifiedUrl').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})



var schemaOptions = {
    toJSON: {
      virtuals: true
    }
  };

const campSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required:true
        
    },
    location:{
        type:String,
        requried:true
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:Array,
            required:true
        }
    }
    ,
    description:{
        type: String,
        requried:true

    },
    images:[imageSchema],
    
    reviews:[{type:Schema.Types.ObjectId,ref:'Review'}],
    owner:{type:Schema.Types.ObjectId,ref:'User'}
},schemaOptions)

campSchema.virtual('properties.popUp').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.name}</a></strong><p>${this.description.substring(0,40)}</p>`
})

campSchema.post('findOneAndDelete',async(deletedCamp)=>{
    if(deletedCamp){
        await Review.deleteMany({_id:{$in: deletedCamp.reviews}})
    }
})

module.exports = mongoose.model('Campground',campSchema)