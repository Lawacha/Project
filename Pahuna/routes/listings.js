const express=require('express')
const router=express.Router()
const Listing = require('../models/listings')
const asyncWrap=require('../utils/asyncWrap')
const {isLoggedIn, isOwner,validateListing}=require('../middleware.js')

//index route
router.get('/', asyncWrap(async (req, res) => {
    let listings = await Listing.find()
    res.render('listings/index.ejs', { listings })
}))

//create route
router.get('/new',isLoggedIn, (req, res) => {
    res.render('listings/new.ejs')
})

router.post('/', validateListing,asyncWrap(async (req, res) => {
    let newListing = new Listing(req.body.listing)
    newListing.owner=req.user._id
    await newListing.save()
    req.flash('success','New listing created successfully')
    res.redirect('/listings')
}))

//show route
router.get('/:id', asyncWrap(async (req, res, next) => {
    let { id } = req.params
    let showList = await Listing.findById(id).populate({path:'review',
        populate:{
            path:('author')}
        })
        .populate('owner');
    if (!showList) {
        req.flash('error','listing doesnot exist')
       return res.redirect('/listings')
    }
    res.render('listings/show.ejs', { showList })
}))

//edit route
router.get('/:id/edit',isLoggedIn, asyncWrap(async (req, res) => {
    let { id } = req.params
    let showList = await Listing.findById(id)
    if(!showList){
        req.flash('error','listing doesnot exist')
        return res.redirect('/listings')
    }
    res.render('listings/edit.ejs', { showList })
}))

router.put('/:id',validateListing,isOwner, asyncWrap(async (req, res) => {
    let { id } = req.params
    let result=await Listing.findByIdAndUpdate(id, req.body.listing)
   if(result){
    req.flash('success','listing edited successfully');
   }
    res.redirect(`/listings/${id}`)
}))

//delete route
router.delete('/:id',isLoggedIn,isOwner, asyncWrap(async (req, res) => {
    let { id } = req.params
    let list = await Listing.findByIdAndDelete(id)
    if(list){
        req.flash('success',"listing deleted successfully")
    }
    res.redirect('/listings')
}))

module.exports=router