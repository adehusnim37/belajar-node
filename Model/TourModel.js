const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rating: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Tour Must have a price.'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
