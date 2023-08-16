const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { now } = require('mongoose');
const User = require('../../Model/UserModel');
const AppError = require('../../utiltys/appError');

const verify = promisify(jwt.verify); //membungkus function dalam function supaya bisa digunakan

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

const signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangeAt: Date.now(),
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'Sukses',
      token,
      data: { user: newUser },
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return next(new AppError(`Email sudah terdaftar!`, 400));
    }
    res.status(401).json({
      message: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError(`Please provide email and the password !`, 400));
    }
    const user = await User.findOne({ email }).select('+password');
    const valid = await user.correctPassword(password, user.password);

    if (!user || !valid) {
      return next(new AppError(`Wrong Email Or Password !`, 401));
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token: token,
    });
  } catch (err) {
    console.log(err);
  }
};

const Protects = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError(`Kamu harus login, untuk mengakses halaman ini !`, 401),
      );
    }
    const decoded = await verify(token, process.env.JWT_SECRET);

    const freshUserToken = await User.findById(decoded.id);
    if (!freshUserToken) {
      return next(new AppError(`The token is no longer exist !`, 401));
    }

    if (freshUserToken.changePasswordAfter(decoded.iat)) {
      return next(new AppError(`User change password, please relogin !`, 401));
    }
    next();
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
};

module.exports = { signUp, login, Protects };
