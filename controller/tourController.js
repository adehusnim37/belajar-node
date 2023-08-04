const { faker } = require('@faker-js/faker');
const Tour = require('../Model/TourModel');

const getAllTours = async (req, res) => {
  try {
    const queryObject = { ...req.query }; // mengeluarkan semua object yang diminta oleh query dan dijadikan menjadi object
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObject[el]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    if (req.body.short) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    const tour = await query;
    res.status(200).json({
      status: 'success',
      result: `Data anda adalah ${tour.length}`,
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
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
      ratingQuantity: faker.number.int({ min: 0, max: 1000 }),
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
