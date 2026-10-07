const express = require('express')
const router = express.Router()
const asyncWrap = require('../utils/asyncWrap')
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')
const listingController = require('../Controllers/Listing.js')

router.route('/')
    .get(asyncWrap(listingController.index))
    .post(validateListing, asyncWrap(listingController.createListing));


//create route
router.get('/new', isLoggedIn, listingController.createForm)

router.route('/:id')
    .get(asyncWrap(listingController.showListing))
    .put(validateListing, isOwner, asyncWrap(listingController.editListing))
    .delete(isLoggedIn, isOwner, asyncWrap(listingController.destroyListing))

//edit route
router.get('/:id/edit', isLoggedIn, asyncWrap(listingController.editForm))

module.exports = router