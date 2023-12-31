const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const moment = require('moment');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
require('dotenv').config();

const AppError = require('./utiltys/appError');
const GlobalErrHandler = require('./controller/errorController');
const tourRoutes = require('./Routes/TourRoutes');
const userRoutes = require('./Routes/UserRoutes');
const reviewRoutes = require('./Routes/ReviewRoutes');

const app = express();
app.use(helmet());
app.use(GlobalErrHandler);

const createLimiter = (limit) =>
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: limit, // Max number of requests within the window
    message: 'Too many requests, please try again later.',
  });

app.use('/api/v1/users', createLimiter(20));
app.use('/api/v1/tours', createLimiter(50));
app.use('/api/v1/review', createLimiter(20));

app.use(morgan('dev'));
//body parser, reading data from req.body
app.use(express.json({ limit: '10kb' }));

//serving static files
app.use(express.static(`${__dirname}/public`));

//data sanitization against no sql query injection
app.use(mongoSanitize());

//data sanitize xss
app.use(xss());

//prevent parameter polution
app.use(
  hpp({
    whitelist: ['duration'],
  }),
);

// kumpulan dari routes
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/review', reviewRoutes);
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

module.exports = app;
