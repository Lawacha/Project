const express=require('express')
const path=require('path')
const methodOverride=require('method-override')
const mongoose=require('mongoose')
const connectDB=require('./config/mongoose.js')
const Posts=require('./models/posts.js')

const app=express()

let port=8080

app.use(methodOverride("_method"));
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

connectDB()
.then(()=>{console.log('connected successfully')})
.catch(err=>console.log(err))

app.get('/',(req,res)=>{
    res.send('hellow')
})

//all posts
app.get('/posts',async(req,res)=>{
    let posts=await Posts.find({})
    res.render('index.ejs',{posts})
})

//new route
app.get('/posts/new',(req,res)=>{
    res.render('new.ejs')
})

app.post('/posts',async(req,res)=>{
    let post=req.body
    console.log(post)
    let inPost=new Posts(post)
    await inPost.save()
    res.redirect('/posts')
})

//update route
app.get('/posts/:id/edit',async(req,res)=>{
    let {id}=req.params
    let post=await Posts.findById(id)
    console.log(post)
    res.render('edit.ejs',{post})
})

app.put('/posts/:id',async(req,res)=>{
    let {id}=req.params
    let {quote:newquote}=req.body
    let newPost=await Posts.findByIdAndUpdate( id, { quote: newquote }, { new: true });
    console.log(newPost)
    res.redirect('/posts')

})

//destroy route
app.delete('/posts/:id',async(req,res)=>{
    let {id}=req.params
    let post=await Posts.findByIdAndDelete(id)
    res.redirect('/posts')
})

//error handling
app.use((err,req,res,next)=>{
    console.log(err.message)
})

app.listen(port,()=>{
    console.log(`listening to port: ${port}`)
})