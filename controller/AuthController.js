const fs = require('fs');
const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../Model/UserModel');
const AppError = require('../utiltys/appError');
const SendEmail = require('../utiltys/NodeMailer');

const verify = promisify(jwt.verify); //membungkus function dalam function supaya bisa digunakan

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

// ... other imports and code

const sendToken = (user, StatusCode, message, res) => {
  const token = signToken(user._id);

  const expirationDate = moment()
    .add(process.env.JWT_COOKIE_EXPIRE_IN, 'days')
    .toDate();

  const cookieOptions = {
    expires: expirationDate,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);
  //remove the password from the output
  user.password = undefined;
  res.status(StatusCode).json({
    status: 'success',
    token: token,
    data: {
      user,
    },
    message: message,
  });
};

const signUp = async (req, res, next) => {
  try {
    const appName = 'Natours';

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangeAt: Date.now(),
    });

    sendToken(newUser, 201, 'User Berhasil SignUp', res);

    const thankYouMessage = fs.readFileSync(
      'message/success-signup.txt',
      'utf8',
    );
    const personalizedMessage = thankYouMessage
      .replaceAll('[Nama Pengguna]', newUser.name)
      .replaceAll('[Nama Aplikasi]', appName)
      .replaceAll('[Email Dukungan]', 'support@gempabu.my.id')
      .replaceAll('[Nomor Telepon Dukungan]', '0000000000000');

    await SendEmail({
      email: newUser.email,
      subject: `Selamat Datang di ${appName}`,
      message: personalizedMessage,
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

    sendToken(user, 201, 'Success Login', res);
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
};

const Protects = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]; //mengambil token dari header
    }
    const decoded = await verify(token, process.env.JWT_SECRET);

    if (!token) {
      return next(
        new AppError(`Kamu harus login, untuk mengakses halaman ini !`, 401),
      );
    }

    const currentUser = await User.findById(decoded.id); //mencari user berdasarkan id yang ada di token
    if (!currentUser) {
      return next(new AppError(`The token is no longer exist !`, 401));
    }

    if (currentUser.changePasswordAfter(decoded.iat)) {
      return next(new AppError(`User change password, please relogin !`, 401));
    }
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
};

const RestrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // mencari roles yang dibutuhkan yang berada di tour routes
      return next(
        new AppError(`You didnt have permision to do this action !`, 403),
      );
    }
    next();
  };

const forgotPass = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new AppError(`There's no user with the email address !`, 404),
      );
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/user/resetPassword/${resetToken}`;

    const message = `
    Halo ${user.name},

    Kami menerima permintaan untuk mereset password akun Anda. Jika Anda tidak mengajukan permintaan ini, Anda dapat mengabaikan email ini.

    Jika Anda ingin mereset password Anda, silakan klik tautan di bawah ini:

    ${resetURL}

    Tautan ini akan mengarahkan Anda ke halaman reset password kami. Setelah tautan terbuka, Anda dapat mengikuti langkah-langkah untuk membuat password baru.`;
    try {
      await SendEmail({
        email: user.email,
        subject: 'Pemberitahuan Lupa Password [Valid selama 10 menit]',
        message: message,
      });
      res.status(200).json({
        status: 'success',
        message: 'Kami telah mengirimkan link reset password di email anda',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.log(err.message);
    }
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      message: err.message,
    });
  }
};
const resetPass = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError(`Token is invalid or expire !`, 404));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    sendToken(user, 200, 'Kami telah mengirimkan message di email anda', res);
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      message: err.message,
    });
  }
};

const updatePass = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    const valid = await user.correctPassword(
      req.body.passwordCurrent,
      user.password,
    );

    if (!valid) {
      return next(new AppError(`Kamu salah memasukkan password lama !`, 401));
    }
    if (!user) {
      return next(new AppError(`Sepertinya kamu belum login deh !`, 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();
    sendToken(user, 200, 'Password Berhasil Diubah', res);
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      message: err.message,
    });
  }
};

module.exports = {
  signUp,
  login,
  Protects,
  RestrictTo,
  forgotPass,
  resetPass,
  updatePass,
};
