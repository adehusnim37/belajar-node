const express = require('express');
const morgan = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
require('dotenv').config();

const AppError = require('./utiltys/appError');
const GlobalErrHandler = require('./controller/errorController');
const tourRoutes = require('./Routes/TourRoutes');
const userRoutes = require('./Routes/UserRoutes');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database telah terkonek');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/user', userRoutes);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `tidak bisa menemukan ${req.originalUrl} pada server ini !`,
  // });
  next(
    new AppError(
      `tidak bisa menemukan ${req.originalUrl} pada server ini !`,
      404,
    ),
  );
});

app.use(GlobalErrHandler);

module.exports = app;
