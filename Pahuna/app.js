const express = require('express')
const mongoose = require('mongoose')
const Listing = require('./models/listings')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const asyncWrap=require('./utils/asyncWrap')
const {listingSchema, reviewSchema}=require('./schema.js')
const Review=require('./models/Review.js')

const app = express()

app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(express.json())
app.set('views', path.join(__dirname, 'views/listings'))
app.use(express.urlencoded({ extended: true }))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "public")))

main()
    .then(res => console.log('connected successfully'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/pahuna');

}

const port = 8080

const validateListing=(req,res,next)=>{
   let {error}= listingSchema.validate(req.body)

   if(error){
    throw new ExpressError(400,error)
   }
   else{
    next()
   }
}

const validateReview=(req,res,next)=>{
   let {error}= reviewSchema.validate(req.body)

   if(error){
    throw new ExpressError(400,error)
   }
   else{
    next()
   }
}

//index route
app.get('/listings', asyncWrap(async (req, res) => {
    let listings = await Listing.find()
    res.render('index.ejs', { listings })
}))

//create route
app.get('/listings/new', (req, res) => {
    res.render('new.ejs')
})

app.post('/listings', validateListing,asyncWrap(async (req, res) => {
    let newListing = new Listing(req.body.listing)
    await newListing.save()
    res.redirect('/listings')
}))

//show route
app.get('/listings/:id', asyncWrap(async (req, res, next) => {
    let { id } = req.params
    let showList = await Listing.findById(id).populate('review')
    if (!showList) {
        throw new ExpressError(404, 'Listing not found')
    }
    
    res.render('show.ejs', { showList })
}))

//edit route
app.get('/listings/:id/edit', asyncWrap(async (req, res) => {
    let { id } = req.params
    let showList = await Listing.findById(id)
    res.render('edit.ejs', { showList })
}))

app.put('/listings/:id',validateListing, asyncWrap(async (req, res) => {
    let { id } = req.params
    let result=await Listing.findByIdAndUpdate(id, req.body.listing)
    res.redirect(`/listings/${id}`)
}))

//delete route
app.delete('/listings/:id', asyncWrap(async (req, res) => {
    let { id } = req.params
    let list = await Listing.findByIdAndDelete(id)
    res.redirect('/listings')
}))

//review route
app.post('/listings/:id/reviews',validateReview,asyncWrap(async(req,res,next)=>{
    let {id}=req.params
    let listing=await Listing.findById(id).populate('review')
    const newReview=new Review(req.body.review)
    listing.review.push(newReview)
    await newReview.save()
    await listing.save()
    res.redirect(`/listings/${id}`)
}))

//check route
app.use((req, res, next) => {
    next(new ExpressError(404, 'Page not found'))
})

//mongoose error handling
const handleValidation = (err) => {
    err.status = 400
    err.message = 'Validation Error: Please enter valid data'
    return err
}

const typeCast = (err) => {
    err.status = 400
    err.message = 'Typecast Error: Id format is incorrect'
    return err
}

const typeError = (err) => {
    err.message = err.message
    err.status = 404
    return err
}

//error handling
app.use((err, req, res, next) => {
    let { status = 500, message = 'Something went wrong' } = err
    if (err.name == 'ValidationError') {
        err = handleValidation(err)
    }
    else if (err.name == "CastError") {
        err = typeCast(err)
    }
    else if (err.name == 'TypeError') {
        err = typeError(err)
    }
    console.log(err.message)
    res.status(status).render('error.ejs', { err })
})

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})