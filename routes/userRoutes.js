const express = require('express')
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync')
const User = require('../controllers/userControl')
const passport = require('passport')



router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',wrapAsync(User.createUser))

router.get('/logout',User.logout)

router.get('/login',User.loginForm)


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), User.login)
module.exports = router;