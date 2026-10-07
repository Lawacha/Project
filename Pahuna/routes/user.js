const express = require('express')
const router = express.Router()
const asyncWrap = require('../utils/asyncWrap')
const passport = require('passport')
const { saveRedirectUrl } = require('../middleware.js')
const UsersController = require('../Controllers/Users.js')


router.route('/signup')
    .get(UsersController.renderSignupForm)
    .post(asyncWrap(UsersController.addUser))

router.route('/login')
    .get(UsersController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), UsersController.loginUser)

router.get('/logout', UsersController.logoutUser)

module.exports = router