const fs = require('fs');
require('dotenv').config({ path: '.env' });
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const Tour = require('../../Model/TourModel');
const User = require('../../Model/UserModel');
const Review = require('../../Model/reviewModel');

mongoose
  .connect(
    'mongodb://adehusnim:ryugamine123@mongo.database.gempabu.my.id:27017/natours',
    {
      useNewUrlParser: true,
    },
  )
  .then(() => {
    console.log('Database telah terkonek');
  })
  .catch((err) => {
    console.log(err);
  });

//Import Data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(tours, { validateBeforeSave: false });
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
