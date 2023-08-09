const express = require("express")
const wrapAsync = require('../utils/wrapAsync')
const router = express.Router();
const {isLoggedIn,isOwner,validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgroundControl')
const {storage} = require('../cloudinary/index')
var multer  = require('multer')
var upload = multer({ storage: storage })

router.route('/')
.get(wrapAsync(campgrounds.allCampgrounds))
.post(isLoggedIn,upload.array('image'),validateCampground,wrapAsync(campgrounds.createNewCampground))

router.get('/new',isLoggedIn,wrapAsync(campgrounds.newCampgroundForm))


router.route('/:id')
.get(wrapAsync(campgrounds.showCampground))
.patch(isLoggedIn,isOwner,upload.array('image'),validateCampground,wrapAsync(campgrounds.updateCampground))
.delete(isLoggedIn,isOwner,wrapAsync(campgrounds.deleteCampground))



router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(campgrounds.updateCampgroundForm))



module.exports = router