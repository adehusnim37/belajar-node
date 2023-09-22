const AppError = require('../utiltys/appError');
const Users = require('../Model/UserModel');
const { Delete, Update, Get } = require('./handler');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });
  return newObject;
};
const getAllUsers = async (req, res) => {
  try {
    const getAll = await Users.find();
    res.status(200).json({
      status: 'berhasil',
      data: { users: getAll },
      message: 'berhasil mendapatkan semua user',
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      data: 'Null',
      message: err.message,
    });
  }
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

const getMe = (req, res, next) => {
  try {
    req.params.id = req.user.id;
    next();
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

const getUser = Get.getOne(Users);

const deleteUser = Delete.deleteOne(Users);

const updateUser = Update.updateOne(Users);

const createUser = (req, res) => {
  res.send(404).json({
    status: 'error',
    message: 'Please Use the signup !',
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
  getMe,
};
