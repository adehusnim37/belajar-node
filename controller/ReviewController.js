// eslint-disable-next-line node/no-unpublished-require,import/no-extraneous-dependencies
const { faker } = require('@faker-js/faker');
const moment = require('moment');
const Review = require('../Model/reviewModel');
const { Delete, Update, Get } = require('./handler');

const createReview = async (req, res, next) => {
  try {
    if (!req.body.tour) {
      req.body.tour = req.params.tourId;
    }
    if (!req.body.user) {
      req.body.user = req.user._id;
    }
    const ReviewData = {
      review: faker.lorem.words({ min: 10, max: 100 }),
      rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
      Date: moment(),
      user: req.body.user,
      tour: req.body.tour,
    };

    const newReview = await Review.create(ReviewData);
    res.status(201).json({
      status: 'success',
      data: { review: newReview },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

const GetAllReview = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }
    const getAll = await Review.find(filter);
    res.status(201).json({
      status: 'success',
      data: { reviews: getAll },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

const DeleteReview = Delete.deleteOne(Review, 'user');
const UpdateReview = Update.updateOne(Review);
const GetAReview = Get.getOne(Review);

module.exports = {
  createReview,
  GetAllReview,
  DeleteReview,
  UpdateReview,
  GetAReview,
};
