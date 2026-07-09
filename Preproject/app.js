const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const connectDB=require('./config/mongoose.js')
const Posts=require('./models/posts.js')
const app=express()

let port=8080

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
    let inPost=await Posts.insertOne(post)
    res.redirect('/posts')
})



app.listen(port,()=>{
    console.log(`listening to port: ${port}`)
})