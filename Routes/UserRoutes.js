const express = require('express');
const { signUp, login } = require('../controller/Auth/AuthController');

const userRouter = express.Router();

userRouter.route('/signUp').post(signUp);
userRouter.route('/login').post(login);
// userRouter.route('/').get().post();
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;
