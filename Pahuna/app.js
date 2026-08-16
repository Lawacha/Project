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
const listings=require('./routes/listings.js')

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

//joi
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

app.use('/listings',listings)

// review add route
app.post('/listings/:id/reviews',validateReview,asyncWrap(async(req,res,next)=>{
    let {id}=req.params
    let listing=await Listing.findById(id).populate('review')
    const newReview=new Review(req.body.review)
    listing.review.push(newReview)
    await newReview.save()
    await listing.save()
    res.redirect(`/listings/${id}`)
}))

//review delete route
app.delete('/listings/:id/reviews/:reviewId',async(req,res)=>{
    let {id,reviewId}=req.params
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
})

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