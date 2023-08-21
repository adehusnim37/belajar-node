const AppError = require('../utiltys/appError');
const Users = require('../Model/UserModel');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });
  return newObject;
};
const getAllUsers = (req, res) => {
  res.send(200).json({
    status: 'berhasil',
    message: 'berhasil mendapatkan semua user',
  });
};

const UpdateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError(`Dilarang menginputkan password !`, 400));
    }
    //filter request user that not allowed to
    const filtedBody = filterObj(req.body, 'name', 'email');
    const UpdatedUser = await Users.findByIdAndUpdate(req.user.id, filtedBody, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'berhasil',
      data: UpdatedUser,
      message: 'berhasil update data kamu',
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

const deleteMe = async (req, res, next) => {
  try {
    await Users.findByIdAndUpdate(req.user.id, { Active: false });
    res.status(204).json({
      status: 'berhasil',
      message: `berhasil menonaktifkan akun ${req.user.name}`,
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

const getUser = (req, res) => {
  res.send(200).json({
    status: 'berhasil',
    message: 'berhasil mendapatkan semua user',
  });
};

const deleteUser = (req, res) => {
  res.send(200).json({
    status: 'berhasil',
    message: 'berhasil mendapatkan semua user',
  });
};

const updateUser = (req, res) => {
  res.send(200).json({
    status: 'berhasil',
    message: 'berhasil mendapatkan semua user',
  });
};

const createUser = (req, res) => {
  res.send(200).json({
    status: 'berhasil',
    message: 'berhasil mendapatkan semua user',
  });
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUser,
  UpdateMe,
  deleteMe,
};
