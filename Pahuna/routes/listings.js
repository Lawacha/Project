const express=require('express')
const router=express.Router()
const Listing = require('../models/listings')
const asyncWrap=require('../utils/asyncWrap')
const ExpressError = require('../utils/ExpressError')
const {listingSchema, reviewSchema}=require('../schema.js')

const validateListing=(req,res,next)=>{
   let {error}= listingSchema.validate(req.body)

   if(error){
    throw new ExpressError(400,error)
   }
   else{
    next()
   }
}

//index route
router.get('/', asyncWrap(async (req, res) => {
    let listings = await Listing.find()
    res.render('index.ejs', { listings })
}))

//create route
router.get('/new', (req, res) => {
    res.render('new.ejs')
})

router.post('/', validateListing,asyncWrap(async (req, res) => {
    let newListing = new Listing(req.body.listing)
    await newListing.save()
    req.flash('success','New listing created successfully')
    res.redirect('/listings')
}))

//show route
router.get('/:id', asyncWrap(async (req, res, next) => {
    let { id } = req.params
    let showList = await Listing.findById(id).populate('review')
    if (!showList) {
        req.flash('error','listing doesnot exist')
       return res.redirect('/listings')
    }
    
    res.render('show.ejs', { showList })
}))

//edit route
router.get('/:id/edit', asyncWrap(async (req, res) => {
    let { id } = req.params
    let showList = await Listing.findById(id)
    if(!showList){
        req.flash('error','listing doesnot exist')
        return res.redirect('/listings')
    }
    res.render('edit.ejs', { showList })
}))

router.put('/:id',validateListing, asyncWrap(async (req, res) => {
    let { id } = req.params
    let result=await Listing.findByIdAndUpdate(id, req.body.listing)
   if(result){
    req.flash('success','listing edited successfully');
   }
    res.redirect(`/listings/${id}`)
}))

//delete route
router.delete('/:id', asyncWrap(async (req, res) => {
    let { id } = req.params
    let list = await Listing.findByIdAndDelete(id)
    if(list){
        req.flash('success',"listing deleted successfully")
    }
    res.redirect('/listings')
}))

module.exports=router