const express = require('express')
const router = express.Router()
const User = require('../models/user')
const asyncWrap = require('../utils/asyncWrap')
const passport = require('passport')
const {saveRedirectUrl}=require('../middleware.js')

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs')
})

router.post('/signup', asyncWrap(async (req, res,next) => {
    try {
        let { username, email, password } = req.body
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            else{
                req.flash('success',"Welcome to Pahuna")
                res.redirect('/listings')
            }
        })
    }
    catch (err) {
        req.flash('error', err.message)
        res.redirect('/signup')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login.ejs')
})

router.post('/login',saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash('success', 'Welcome back to Pahuna')
   
    res.redirect(res.locals.redirectUrl || '/listings')
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err)
        }
        req.flash('success', 'Logged out successfully')
        res.redirect('listings')
    })
})

module.exports = router