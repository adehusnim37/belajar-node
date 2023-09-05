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
const { Protects, RestrictTo } = require('../controller/AuthController');
const reviewRouter = require('./ReviewRoutes');

const router = express.Router();
router.route('/top5').get(aliasTopTour, getAllTours);
router.route('/tours-stats').get(getToursStats);
router.route('/monthly-plan/:year').get(monthlyPlan);

//router.param('id', checkId);
router.route('/').get(Protects, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(Protects, RestrictTo('admin', 'lead-guide'), deleteTour);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
