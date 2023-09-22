const AppError = require('../../utiltys/appError');

exports.deleteOne = (Model, idField) => async (req, res, next) => {
  try {
    //Pengecekan pertama apakah idField ada (truthy) dan peran (role) model adalah 'user'
    if (idField && req.user.role === 'user') {
      const doc = await Model.findOneAndDelete({
        _id: req.params.id, //mencari id yang sama dengan id yang dikirimkan
        [idField]: req.user._id, //mencari user id yang sama dengan user id yang sedang login
      });

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(204).json({
        status: 'success',
        message: 'Success deleting document',
        data: null,
      }); // 204 means no content
      return;
    }

    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      message: 'Document successfully deleted',
      data: null,
    });
  } catch (err) {
    next(new AppError(`Error deleting document: ${err.message}`, 500));
  }
};
