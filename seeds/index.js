const Campground = require('../models/camp.js')
const mongoose = require("mongoose")
const cities = require("./cities.js")
const seedHelper = require("./seedHelper.js")
const {descriptors,places} = seedHelper


mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("DB Connected")
})
.catch((err)=>{
    console.log(err)
})

const sample = (array)=>{
   let randomIndex  = Math.floor(Math.random()*array.length)
   return array[randomIndex]
}

const seedDB = async()=>{
    await Campground.deleteMany({})
    for(let i = 0; i < 400;i++){
        
        let random  = Math.floor(Math.random()*1000)
        let geometry = { coordinates: [ cities[random].longitude, cities[random].latitude], type: 'Point' }
        let location = `${cities[random].city}, ${cities[random].state}`
        let name = `${sample(descriptors)} ${sample(places)}`
        let price = Math.floor(Math.random()*20)+10
        let image = 'https://source.unsplash.com/collection/483251'
        let description = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi quod exercitationem omnis vitae quia illo sunt officia in, libero ut, ea velit laborum tenetur nesciunt nostrum laudantium aliquam ab? Veniam.'
        await new Campground({location:location, name:name,price:price,description:description,images:[{
           url: image}],
           geometry:geometry
            ,owner:'60dc1df2f20b711914dcc2a0'}).save()
    }
}
seedDB()