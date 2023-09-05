const AppError = require('../../utiltys/appError');

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
      message: 'Document successfully deleted',
    });
  } catch (err) {
    next(new AppError(`Error deleting document: ${err.message}`, 500));
  }
};
