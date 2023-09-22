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

review.use(Protects); /// protect all routes after this middleware
review
  .route('/')
  .get(RestrictTo('admin'), GetAllReview)
  .post(RestrictTo('user'), createReview);

review
  .route('/:id')
  .get(GetAReview)
  .patch(RestrictTo('user'), UpdateReview)
  .delete(RestrictTo('admin', 'user'), DeleteReview);

module.exports = review;
