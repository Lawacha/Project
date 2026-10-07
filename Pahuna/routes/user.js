const express = require('express')
const router = express.Router()
const asyncWrap = require('../utils/asyncWrap')
const passport = require('passport')
const {saveRedirectUrl}=require('../middleware.js')
const UsersController=require('../Controllers/Users.js')

//signup form
router.get('/signup',UsersController.renderSignupForm)

//signup 
router.post('/signup', asyncWrap(UsersController.addUser))

router.get('/login',UsersController.renderLoginForm)

router.post('/login',saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), UsersController.loginUser)

router.get('/logout', UsersController.logoutUser)

module.exports = router