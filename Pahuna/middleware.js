const Listing=require('./models/listings.js')
const ExpressError = require('./utils/ExpressError')
const {listingSchema,reviewSchema}=require('./schema.js')


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url
    req.session.redirectUrl=req.originalUrl
        req.flash('error','you must logged in to create changes')
        return res.redirect('/login')
    }
    next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
}next()
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
      let listing=await Listing.findById(id)
      if (!listing)
         { req.flash("error", "Listing not found"); 
            return res.redirect("/listings"); }
     if (!res.locals.currentUser||res.locals.currentUser._id.equals(listing.owner._id)){
        req.flash('error','You are not owner of this listing')
       return  res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing=(req,res,next)=>{
   let {error}= listingSchema.validate(req.body)

   if(error){
    throw new ExpressError(400,error)
   }
   else{
    next()
   }
}

module.exports.validateReview=(req,res,next)=>{
   let {error}= reviewSchema.validate(req.body)

   if(error){
    throw new ExpressError(400,error)
   }
   else{
    next()
   }
}