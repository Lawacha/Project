const express=require('express')
const router=express.Router()
const Listing = require('../models/listings')
const asyncWrap=require('../utils/asyncWrap')
const {isLoggedIn, isOwner,validateListing}=require('../middleware.js')
const listingController=require('../Controllers/Listing.js')

//index route
router.get('/', asyncWrap(listingController.index))

//create route
router.get('/new',isLoggedIn,listingController.createForm )

router.post('/', validateListing,asyncWrap(listingController.createListing))

//show route
router.get('/:id', asyncWrap(listingController.showListing))

//edit route
router.get('/:id/edit',isLoggedIn, asyncWrap(listingController.editForm))

router.put('/:id',validateListing,isOwner, asyncWrap(listingController.editListing))

//delete route
router.delete('/:id',isLoggedIn,isOwner, asyncWrap(listingController.destroyListing))

module.exports=router