const express=require('express')
const router=express.Router({mergeParams:true})
const asyncWrap=require('../utils/asyncWrap')
const {validateReview, isLoggedIn, isReviewAuthor}=require('../middleware.js')
const reviewController=require('../Controllers/Reviews.js')


// review add route
router.post('/',isLoggedIn,validateReview,asyncWrap(reviewController.addReview))

//review delete route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,reviewController.deleteReview)

module.exports=router