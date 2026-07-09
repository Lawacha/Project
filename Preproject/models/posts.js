const mongoose=require('mongoose')

const postSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    quote:{
        type:String,
        required:true
    },
    email:{
        type:String,  
    }
})

let Posts=new mongoose.model('Post',postSchema)

module.exports=Posts