module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.flash('error','you must logged in to create changes')
        return res.redirect('/login')
    }
    next()
}