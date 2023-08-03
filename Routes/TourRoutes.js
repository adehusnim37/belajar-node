const express = require('express');
const {
  getAllTours,
  createTour,
  updateTour,
  getTour,
  deleteTour,
  checkId,
  checkBody,
} = require('../controller/tourController');

const router = express.Router();

//router.param('id', checkId);
router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
