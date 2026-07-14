const express=require('express')
const mongoose=require('mongoose')
const Listing=require('./models/listings')
const path=require('path')

const app=express()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

main()
.then(res=>console.log('connected successfully'))
.catch(err => console.log(err)); 

async function  main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/pahuna');

}

const port=8080

//index route
app.get('/listings',async(req,res)=>{
    let listings=await Listing.find()
    res.render('index.ejs',{listings})
})

//show route
app.get('/listings/:id',async(req,res)=>{
    let {id}=req.params
    let showList=await Listing.findById(id)
    res.render('show.ejs',{showList})
})

app.listen(port,()=>{
    console.log(`listening to port ${port}`)
})