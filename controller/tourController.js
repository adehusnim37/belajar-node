const { faker } = require('@faker-js/faker');
const Tour = require('../Model/TourModel');
const APIFeatures = require('../utiltys/apiFeatures');

const aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratings,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tour = await features.query;
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
      avgRating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
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

const getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { rating: { $gte: 1 } } },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$rating' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: { stats },
      message: 'Tour statistics successfully retrieved',
    });
  } catch (err) {
    res.status(204).json({
      status: 'success',
      data: null,
      message: err.message,
    });
  }
};

const monthlyPlan = async (req, res) => {
  try {
    const year = Number(req.params.year);
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: { _id: { $month: '$startDates' } },
        numTourStarts: { $sum: 1 },
        tours: { $push: 'name' },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: { plan },
      message: 'Tour statistics successfully retrieved',
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
  aliasTopTour,
  getToursStats,
  monthlyPlan,
};
