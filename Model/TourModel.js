const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./UserModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: [45, 'tour must have less or equal 45 characters'],
      minLength: [10, 'tour must have less or equal 10 characters'],
      validator: [validator.isAlpha, 'Nama Harus Karakter'],
    },
    avgRating: {
      type: Number,
      default: 0,
      minLength: [1, 'tour must above 1'],
      maxLength: [5, 'tour must below 5'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: [true, 'Harus mempunyai durasi hari'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Harus mempunyai max pelangan'],
    },
    difficulty: {
      type: String,
      required: [true, 'Harus ada kesulitan'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'difficulty either : easy, normal, hard',
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Tour Must have a price.'],
      minLength: [1, 'tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          //this only works in create
          return value <= this.price;
        },
        message: 'Discount Price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    location: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: User }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//index untuk mempercepat pencarian
tourSchema.index({ price: 1, ratingsAverage: -1 }); //1 untuk ascending -1 untuk descending
tourSchema.index({ slug: 1 }); //slug untuk mempercepat pencarian

//query middleware
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeAt',
  });
  next();
});

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id', // Replace this with the correct field in your Tour schema
  foreignField: 'tour', // Replace this with the correct field in your Review schema
});

tourSchema.pre(/^find/, function (next) {
  //regex untuk mencari kata yang berawalan find
  this.find({ secretTour: { $ne: true } }); //ne adalah not equal
  this.start = Date.now();
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
// tourSchema.post(/^find/, function (doc, next) {
//   console.log(
//     `Query memakan waktu sebanyak ${Date.now() - this.start} millisecond`,
//   );
//   next();
// });

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
