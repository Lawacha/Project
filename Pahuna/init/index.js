const mongoose=require('mongoose')
const initData=require('./data')
const Listing=require('../models/listings')

main()
.then(res=>console.log('connected successfully'))
.catch(err => console.log(err)); 

async function  main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/pahuna');

}

async function initDb() {
   let res=await Listing.insertMany(initData.data)
    console.log(res)
    
}

initDb()