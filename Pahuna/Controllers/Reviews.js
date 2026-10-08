const Listing = require('../models/listings')
const Review = require('../models/Review')

module.exports.addReview = async (req, res, next) => {
    let { id } = req.params
    let listing = await Listing.findById(id).populate('review')
    const newReview = new Review(req.body.review)
    newReview.author = req.user._id
    listing.review.push(newReview)

    await newReview.save()
    await listing.save()
    req.flash('success', 'New review created successfully')
    res.redirect(`/listings/${id}`)
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review Deleted successfully')
    res.redirect(`/listings/${id}`)
}