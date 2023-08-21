const express = require('express');
const {
  signUp,
  login,
  forgotPass,
  resetPass,
  Protects,
  updatePass,
} = require('../controller/Auth/AuthController');
const { UpdateMe, deleteMe } = require('../controller/userController');

const userRouter = express.Router();

userRouter.route('/signUp').post(signUp);
userRouter.route('/login').post(login);

userRouter.route('/forgotPassword').post(forgotPass);
userRouter.route('/resetPassword/:token').patch(resetPass);
userRouter.route('/updateMyPassword').patch(Protects, updatePass);
userRouter.route('/UpdateMe').patch(Protects, UpdateMe);
userRouter.route('/deleteMe').delete(Protects, deleteMe);

// userRouter.route('/').get().post();
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;
