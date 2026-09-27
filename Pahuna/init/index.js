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
    await Listing.deleteMany({})
    let datawithowner=initData.data.map((obj)=>({...obj,owner:"6aafbf612a70f54b55fdb7c4"}))
   let res=await Listing.insertMany(datawithowner)
    console.log(res)
    
}

initDb()