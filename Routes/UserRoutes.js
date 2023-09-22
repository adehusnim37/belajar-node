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
  getMe,
  getUser,
} = require('../controller/userController');

const userRouter = express.Router();

userRouter.route('/signUp').post(signUp);
userRouter.route('/login').post(login);
userRouter.route('/resetPassword/:token').patch(resetPass);
userRouter.route('/updateMyPassword').patch(Protects, updatePass);

userRouter.use(Protects); /// protect all routes after this middleware
userRouter.route('/forgotPassword').post(forgotPass);
userRouter.route('/me').get(getMe, getUser);
userRouter.route('/UpdateMe').patch(UpdateMe);
userRouter.route('/deleteMe').delete(deleteMe);

userRouter.use(RestrictTo('admin')); /// protect all routes to admin users after this middleware
userRouter.route('/').get(Protects, getAllUsers);
userRouter.route('/:id').delete(deleteUser).patch(updateUser);

module.exports = userRouter;
