const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const listingRouter=require('./routes/listings.js')
const reviewRouter=require('./routes/reviews.js')
const userRouter=require('./routes/user.js')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User=require('./models/user.js')

const app = express()

app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
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

//added expiry date 
const sessionOptions=({
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
})

//session and flash
app.use(session(sessionOptions))
app.use(flash());

//passport
passport.initialize()
passport.session()
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//middleware for flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next()
})

//demo user
// app.get('/demouser',async(req,res)=>{
//     let fakeUser=new User({
//         email:'sup@gmail.com',
//         username:'supp'
//     })
//     let regUser=await User.register(fakeUser,"password")
//     res.send(regUser)
// })

//routing 
app.use('/listings',listingRouter)
app.use('/listings/:id/reviews',reviewRouter)
app.use('/signup',userRouter)

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
    res.status(status).render('listings/error.ejs', { err })
})

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})