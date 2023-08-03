const express = require('express');
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
} = require('../controller/userController');
const userRouter = express.Router();

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;
