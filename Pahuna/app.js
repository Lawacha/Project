const express=require('express')
const mongoose=require('mongoose')
const Listing=require('./models/listings')
const path=require('path')
const methodOverride = require('method-override')
const ejsMate=require('ejs-mate')
const ExpressError=require('./utils/ExpressError')

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

const asyncWrap=(fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch(err=>next(err))
    }
}

//index route
app.get('/listings',asyncWrap(async(req,res)=>{
      let listings=await Listing.find()
    res.render('index.ejs',{listings})
}))

//create route
app.get('/listings/new',(req,res)=>{
    res.render('new.ejs')
})

app.post('/listings',asyncWrap(async(req,res)=>{
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
}))

//show route
app.get('/listings/:id',asyncWrap(async(req,res,next)=>{
   try{
     let {id}=req.params
    let showList=await Listing.findById(id)

    if(!showList){
        throw new ExpressError(404,'Listing not found')
    }
    res.render('show.ejs',{showList})
   }
   catch(err){
    next(err)
   }
}))

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

//mongoose error handling
const handleValidation=(err)=>{
    err.status=400
    err.message='Validation Error: Please enter valid data'
return err
}

const typeCast=(err)=>{
    err.status=400
    err.message='Typecast Error: Id format is incorrect'
    return err
}

const typeError=(err)=>{
    err.message='Type Error: Not Found'
    err.status=404
    return err
}


//check route
app.use((req,res,next)=>{
    next(new ExpressError(404,'Page not found'))
})

//error handling
app.use((err,req,res,next)=>{

    console.log(err.name)
    if(err.name=='ValidationError'){
        err=handleValidation(err)
    }
    else if(err.name=="CastError"){
        err=typeCast(err)
    }
    else if(err.name=='TypeError'){
        err=typeError(err)
    }
    let {status=500,message='Something went wrong'}=err
    res.status(status).render('error.ejs',{err})
})

app.listen(port,()=>{
    console.log(`listening to port ${port}`)
})