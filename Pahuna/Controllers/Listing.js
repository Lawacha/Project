let Listing=require('../models/listings.js')

//index route
module.exports.index= async (req, res) => {
    let listings = await Listing.find()
    res.render('listings/index.ejs', { listings })
}

//get - create
module.exports.createForm=(req, res) => {
    res.render('listings/new.ejs')
}

//post - create
module.exports.createListing=async (req, res) => {
    let newListing = new Listing(req.body.listing)
    newListing.owner=req.user._id
    await newListing.save()
    req.flash('success','New listing created successfully')
    res.redirect('/listings')
}

//show route
module.exports.showListing=async (req, res, next) => {
    let { id } = req.params
    let showList = await Listing.findById(id).populate({path:'review',
        populate:{
            path:('author')}
        })
        .populate('owner');
    if (!showList) {
        req.flash('error','listing doesnot exist')
       return res.redirect('/listings')
    }
    res.render('listings/show.ejs', { showList })
}

//get - edit
module.exports.editForm=async (req, res) => {
    let { id } = req.params
    let showList = await Listing.findById(id)
    if(!showList){
        req.flash('error','listing doesnot exist')
        return res.redirect('/listings')
    }
    res.render('listings/edit.ejs', { showList })
}

//post - edit
module.exports.editListing=async (req, res) => {
    let { id } = req.params
    let result=await Listing.findByIdAndUpdate(id, req.body.listing)
   if(result){
    req.flash('success','listing edited successfully');
   }
    res.redirect(`/listings/${id}`)
}

//delete
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params
    let list = await Listing.findByIdAndDelete(id)
    if(list){
        req.flash('success',"listing deleted successfully")
    }
    res.redirect('/listings')
}