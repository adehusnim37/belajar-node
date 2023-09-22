const express = require('express');
const {
  getAllTours,
  createTour,
  updateTour,
  getTour,
  deleteTour,
  aliasTopTour,
  getToursStats,
  monthlyPlan,
} = require('../controller/tourController');
const {
  Protects,
  RestrictTo,
  allowUserAccess,
} = require('../controller/AuthController');
const reviewRouter = require('./ReviewRoutes');

const tourRouter = express.Router();

tourRouter.use('/:tourId/reviews', reviewRouter);
tourRouter.route('/top5').get(aliasTopTour, getAllTours);
tourRouter.route('/tours-stats').get(getToursStats);

tourRouter.use(Protects); /// protect all routes after this middleware
tourRouter
  .route('/monthly-plan/:year')
  .get(RestrictTo('admin', 'lead-guide', 'guide'), monthlyPlan);

tourRouter
  .route('/:id')
  .get(RestrictTo('admin', 'lead-guide', 'user'), getTour);
tourRouter.use(RestrictTo('admin', 'lead-guide')); /// protect all routes to admin users and lead guide after this middleware
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
