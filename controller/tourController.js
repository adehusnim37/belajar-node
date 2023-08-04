const { faker } = require('@faker-js/faker');
const Tour = require('../Model/TourModel');

const getAllTours = async (req, res) => {
  try {
    const newTour = await Tour.find();
    res.status(200).json({
      status: 'success',
      result: `Data anda adalah ${newTour.length}`,
      data: newTour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTourData = {
      name: faker.location.city(3),
      description: faker.lorem.words({ min: 50, max: 150 }),
      ratingQuantity: faker.number.int(),
      price: faker.number.int({ min: 100, max: 1000 }),
      rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      duration: faker.number.int({ min: 1, max: 10 }), // Adjust the min and max values based on your requirements
      maxGroupSize: faker.number.int({ min: 1, max: 20 }), // Adjust the min and max values based on your requirements
      difficulty: faker.helpers.arrayElement(['easy', 'normal', 'hard']),
      priceDiscount: faker.number.int({ min: 0, max: 100 }),
      summary: faker.lorem.sentence(10),
      imageCover: faker.image.url(),
      images: Array.from({ length: 3 }, () => faker.image.url()),
      startDates: [faker.date.future(), faker.date.future()],
      // Add other properties as needed
    };
    const newTour = await Tour.create(newTourData);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params; //mengambil property id didalam objek
    const newTour = await Tour.findByIdAndDelete(id);

    if (!newTour) {
      // If the tour was not found
      return res.status(404).json({
        status: 'failed',
        message: 'Tour not found',
      });
    }
    res.status(201).json({
      status: 'success',
      data: null,
      message: 'Tour successfully deleted',
    });
  } catch (err) {
    res.status(204).json({
      status: 'success',
      data: null,
      message: err.message,
    });
  }
};

module.exports = {
  deleteTour,
  createTour,
  updateTour,
  getTour,
  getAllTours,
};
