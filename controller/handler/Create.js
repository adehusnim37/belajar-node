const AppError = require('../../utiltys/appError');

exports.createOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (err) {
    next(new AppError(`Error creating document: ${err.message}`, 404));
  }
};
