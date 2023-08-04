const fs = require('fs');
require('dotenv').config({ path: '.env' });
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const Tour = require('../../Model/TourModel');

mongoose
  .connect('mongodb://adehusnim:ryugamine123@157.230.251.148:27017/natours', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Database telah terkonek');
  })
  .catch((err) => {
    console.log(err);
  });

//Import Data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
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
