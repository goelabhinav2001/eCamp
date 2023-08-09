if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const method_override = require("method-override")
const Campground = require('./models/camp.js')
const ejsMate = require("ejs-mate")
const ExpressError = require('./utils/ExpressError')
const wrapAsync = require('./utils/wrapAsync')
const {campgroundSchema, reviewSchema} = require('./campgroundSchema');
const Review = require('./models/review')
const campgroundRoutes = require('./routes/campgroundRoutes.js')
const reviewRoutes = require("./routes/reviewRoutes.js")
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport')
const localStrategy = require('passport-local')
const User= require('./models/user')
const userRoutes = require('./routes/userRoutes')
const mongoSanitize = require('express-mongo-sanitize')
const helmet= require('helmet')
const mongoDbUrl = process.env.MONGO_DB_URL;
const MongoStore = require('connect-mongo');

mongoose.connect(mongoDbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("DB Connected")
})
.catch((err)=>{
    console.log(err)
})

const secret = process.env.SECRET || "weneedabettersecret"

const store = new MongoStore({
    mongoUrl: mongoDbUrl,
    secret: secret,
    touchAfter: 24*60*60

})

store.on("error",function(){
    console.log("session store error")
})



const sessionConfig = {
    store,
    name:'session',
    secret:secret,
    resave:false,
    saveUninitialzied:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 *24 * 7,
        maxAge: 1000 * 60 * 60 *24 * 7
    }                             
}

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(method_override("_method"))

app.use(mongoSanitize());

app.use(express.static(path.join(__dirname,'public')));

app.use(session(sessionConfig))

app.use(flash())

app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css",
    "https://kit-free.fontawesome.com",

    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = ["https://fonts.gstatic.com"];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dd5a8yar0/",  
                "https://source.unsplash.com",
                "https://images.unsplash.com"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(passport.initialize());
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    })
   


app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/review',reviewRoutes)

const port = process.env.PORT || 8080

app.listen(port,()=>{
    console.log(`Listening at port ${port}`)
})

app.get('/',(req,res)=>{
    res.render('home.ejs')
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const{statusCode = 500} = err
    if(!err.message){
        err.message = 'Oh No, something went wrong'
    }
   res.status(statusCode).render("error",{err})
})