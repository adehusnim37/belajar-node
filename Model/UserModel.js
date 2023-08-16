const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell me your name'],
    maxLength: [35, 'name must have less or equal 35 characters'],
    minLength: [5, 'tour must have less or equal 5 characters'],
    validator: [validator.isAlphanumeric, 'Nama Harus Karakter'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validator: [validator.isEmail, 'Harus bertype email'],
    lowercase: true,
  },
  photo: {
    type: String,
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
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); //berjalan jika password telah diubah

  this.password = await bcrypt.hash(this.password, 15);

  this.passwordConfirm = undefined;
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
    const changetimeStamp = Math.floor(this.passwordChangeAt / 1000) + 5;
    return JWTTimestamp < changetimeStamp;
  }
  return false;
};
const User = mongoose.model('User', UserSchema);

module.exports = User;
