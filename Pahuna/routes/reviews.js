const express=require('express')
const router=express.Router({mergeParams:true})
const Listing = require('../models/listings')
const Review=require('../models/Review')
const asyncWrap=require('../utils/asyncWrap')
const {validateReview, isLoggedIn, isReviewAuthor}=require('../middleware.js')


// review add route
router.post('/',isLoggedIn,validateReview,asyncWrap(async(req,res,next)=>{
    let {id}=req.params
    let listing=await Listing.findById(id).populate('review')
    const newReview=new Review(req.body.review)
    newReview.author=req.user._id
    listing.review.push(newReview)
   
    await newReview.save()
    await listing.save()
     req.flash('success','New review created successfully')
    res.redirect(`/listings/${id}`)
}))

//review delete route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,async(req,res)=>{
    let {id,reviewId}=req.params
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    await Review.findByIdAndDelete(reviewId)
     req.flash('success','Review Deleted successfully')
    res.redirect(`/listings/${id}`)
})

module.exports=router