const express=require('express')
const router=express.Router()
const User=require('../models/user')
const asyncWrap = require('../utils/asyncWrap')

router.get('/',(req,res)=>{
 res.render('users/signup.ejs')
})

router.post('/',asyncWrap(async(req,res)=>{
    try{
        let {username,email,password}=req.body
    const newUser=new User({email,username})
    const registeredUser=await User.register(newUser,password)
    req.flash('success','Welcome to Pahuna')
    console.log(registeredUser)
    res.redirect('/listings')
    }
    catch(err){
        req.flash('error',err.message)
        res.redirect('/signup')
    }
}) )

module.exports=router