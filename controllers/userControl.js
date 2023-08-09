const User = require('../models/user')



module.exports.createUser = async(req,res,next)=>{
    try{
      const {username,email,password} = req.body;
       const user = new User({username,email})
      
       const registeredUser = await User.register(user,password);
       req.login(registeredUser,(err)=>{
           if(err){
             return  next(err);
           }
           req.flash('success','Successfully registered')
           res.redirect('/campgrounds')
       })
      
      }
      catch(e){
         
          req.flash('error',e.message)
          res.redirect('/register')
      }
  
  }

  module.exports.logout = (req,res)=>{
    req.logOut();
    req.flash('success','Goodbye!')
    res.redirect('/campgrounds')
}

module.exports.loginForm = (req,res)=>{
    res.render('users/login')}

    module.exports.login = (req, res) => {
        req.flash('success', 'welcome back!');
    
        const url = req.session.returnTo || '/campgrounds'
        delete req.session.returnTo;
    
       
        res.redirect(url);
    }