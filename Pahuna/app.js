const express=require('express')
const mongoose=require('mongoose')
const Listing=require('./models/listings')
const path=require('path')
const methodOverride = require('method-override')
const ejsMate=require('ejs-mate')
const ExpressError=require('./init/ExpressError')

const app=express()

app.use(methodOverride('_method'))
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views/listings'))
app.use(express.urlencoded({extended:true}))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"public")))

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

//create route
app.get('/listings/new',(req,res)=>{
    res.render('new.ejs')
})

app.post('/listings',async(req,res)=>{
    let {title,description,image,price,location,country}=req.body
    let newListing= new Listing({
        title:title,
        description:description,
        image:{
            url:image
        },
        price:price,
        location:location,
        country:country
    })
    await newListing.save()
    res.redirect('/listings')
})

//show route
app.get('/listings/:id',async(req,res)=>{
    let {id}=req.params
    let showList=await Listing.findById(id)
    res.render('show.ejs',{showList})
})

//edit route
app.get('/listings/:id/edit',async(req,res)=>{
    let {id}=req.params
    let showList=await Listing.findById(id)
    res.render('edit.ejs',{showList})
})

app.put('/listings/:id',async(req,res)=>{
    let {id}=req.params
    let {title,description,image,price,location,country}=req.body
    await Listing.findByIdAndUpdate(id,{
        title:title,
        description:description,
        image:{
            url:image
        },
        price:price,
        location:location,
        country:country
    })
    res.redirect('/listings')
})

//delete route
app.delete('/listings/:id',async(req,res)=>{
    let {id}=req.params
    let list=await Listing.findByIdAndDelete(id)
    res.redirect('/listings')
})

//error handling
app.use((err,req,res,next)=>{
    let {status,message='err occured'}=err
    res.send(message)
})

app.listen(port,()=>{
    console.log(`listening to port ${port}`)
})