const Tour = require('../Model/TourModel');

const checkBody = (req, res, next) => {
  if (!req.body.id || !req.body.price) {
    return res.status(404).json({
      message: 'failed',
      return: 'Harga atau nama tidak ada',
    });
  }
  next();
};
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results_data: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Berhasil Di Update',
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
    message: 'berhasil dihapus',
  });
};

module.exports = {
  deleteTour,
  createTour,
  updateTour,
  getTour,
  getAllTours,
  checkId,
  checkBody,
};
