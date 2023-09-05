const express = require('express');
const {
  signUp,
  login,
  forgotPass,
  resetPass,
  Protects,
  updatePass,
  RestrictTo,
} = require('../controller/AuthController');
const {
  UpdateMe,
  deleteMe,
  deleteUser,
  getAllUsers,
  updateUser,
} = require('../controller/userController');

const userRouter = express.Router();

userRouter.route('/signUp').post(signUp);
userRouter.route('/login').post(login);

userRouter.route('/forgotPassword').post(forgotPass);
userRouter.route('/resetPassword/:token').patch(resetPass);
userRouter.route('/updateMyPassword').patch(Protects, updatePass);
userRouter.route('/UpdateMe').patch(Protects, UpdateMe);
userRouter.route('/deleteMe').delete(Protects, deleteMe);

userRouter.route('/').get(Protects, RestrictTo('admin'), getAllUsers);
userRouter
  .route('/:id')
  .delete(Protects, RestrictTo('admin'), deleteUser)
  .patch(Protects, RestrictTo('admin'), updateUser);

module.exports = userRouter;
