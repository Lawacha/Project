const { string } = require('joi');
const mongoose=require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

//automatically creates username and provides hashed password fields in the user Schema
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema)