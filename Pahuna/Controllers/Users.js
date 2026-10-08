const User = require('../models/user.js')

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs')
}

module.exports.addUser = async (req, res, next) => {
    try {
        let { username, email, password } = req.body
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            else {
                req.flash('success', "Welcome to Pahuna")
                res.redirect('/listings')
            }
        })
    }
    catch (err) {
        req.flash('error', err.message)
        res.redirect('/signup')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs')
}

module.exports.loginUser = async (req, res) => {
    req.flash('success', 'Welcome back to Pahuna')

    res.redirect(res.locals.redirectUrl || '/listings')
}

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err)
        }
        req.flash('success', 'Logged out successfully')
        res.redirect('/listings')
    })
}