const express = require('express');
const {
  GetAllReview,
  createReview,
  DeleteReview,
  UpdateReview,
  GetAReview,
} = require('../controller/ReviewController');
const { Protects, RestrictTo } = require('../controller/AuthController');

const review = express.Router({ mergeParams: true });

review.route('/').get(Protects, GetAllReview).post(Protects, createReview);

review
  .route('/:id')
  .get(Protects, GetAReview)
  .patch(Protects, UpdateReview)
  .delete(Protects, RestrictTo('admin'), DeleteReview);

module.exports = review;
