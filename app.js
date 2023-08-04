const express = require('express');
const morgan = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
require('dotenv').config();

const tourRoutes = require('./Routes/TourRoutes');
const userRoutes = require('./Routes/UserRoutes');

mongoose
  .connect(process.env.DATABASEURI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Database telah terkonek');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/tours', tourRoutes);
app.use('api/v1/user', userRoutes);

module.exports = app;
