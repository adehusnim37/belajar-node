const mongoose = require('mongoose');
const Tour = require('./TourModel');
const User = require('./UserModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: Tour, // Replace 'Tour' with the actual model name if needed
      required: [true, 'Review must be associated with a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: User, // Replace 'User' with the actual model name if needed
      required: [true, 'Review must be associated with a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // })
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // 'this' points to the current model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        // _id: '$tour', // Group by tour
        _id: null, // Group all reviews
        nRating: { $sum: 1 }, // menambahkan 1 setiap kali ada review
        avgRating: { $avg: '$rating' }, // Calculate average rating
      },
    },
  ]);

  // Update tour document
  await Tour.findByIdAndUpdate(tourId, {
    // mencari tour berdasarkan id
    ratingQuantity: stats[0].nRating, // mengupdate ratingQuantity
    avgRating: stats[0].avgRating, // mengupdate ratingAverage, stats[0] karena hasil dari aggregate adalah array
  });
};

reviewSchema.post('save', function () {
  // 'this' points to the current document
  this.constructor.calcAverageRatings(this.tour); //this.constructor adalah model yang saat ini dipakai
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
