const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const isAlphaSpaces = (value) => /^[A-Za-z\s]+$/.test(value);
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell me your name'],
    maxLength: [35, 'Name must have less or equal 35 characters'],
    minLength: [5, 'Name must have less or equal 5 characters'],
    validate: [isAlphaSpaces, 'Nama Harus Karakter'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Harus bertype email'],
    lowercase: true,
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minLength: [8, 'Minimal password harus 8 Karakter'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Masukkan kembali passwordmu'],
    validate: {
      //only works in save
      validator: function (el) {
        return el === this.password;
      },
      message: 'password tidak sama',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  Active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  //returns true if the 'password' field has not been modified, and false if the field has been modified.
  this.password = await bcrypt.hash(this.password, 15);

  this.passwordConfirm = undefined;
  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  //password belum diubah atau seorang membuat user create akun baru

  this.passwordChangeAt = Date.now() - 5000;
  next();
});

UserSchema.pre(/^find/, function (next) {
  this.find({ Active: { $ne: false } });
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changetimeStamp = Math.floor(this.passwordChangeAt / 1000) - 5; // ditambah 5 detik dikarenakan jwttimestamp terlebih dahulu diproses
    return JWTTimestamp < changetimeStamp; //jika timestamp jwt lebih kecil maka harus relogin lagi
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', UserSchema);

module.exports = User;
