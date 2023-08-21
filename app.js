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

const app = express();
app.use(helmet());
app.use(GlobalErrHandler);

const limiter = rateLimit({
  max: 50,
  windowMs: moment.duration(1, 'hour').asMilliseconds(), // Set windowMs to 1 hour in milliseconds
  standardHeaders: true,
  legacyHeaders: false,
  message: 'To many request, please try again later in a hour',
});

app.use('/api', limiter);
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

module.exports = app;
