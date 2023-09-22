const AppError = require('../../utiltys/appError');

exports.updateOne = (Model, idField) => async (req, res, next) => {
  try {
    if (idField && req.user.role === 'user') {
      const doc = await Model.findOneAndUpdate(
        {
          _id: req.params.id, //mencari id yang sama dengan id yang dikirimkan
          [idField]: req.user.id, //mencari user id yang sama dengan user id yang sedang login
        },
        req.body,
        {
          returnDocument: 'after', //returnDocument: 'after' adalah opsi yang digunakan di metode findOneAndUpdate, sementara new: true digunakan di metode findByIdAndUpdate
          runValidators: true,
        },
      );
      if (!doc)
        return next(new AppError(`Invalid ${Model} ID / forbidden`, 403));

      res.status(200).json({
        status: 'success',
        data: {
          [`${Model}`]: doc,
        },
      });
      return;
    }
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true, //mengembalikan data yang sudah diupdate
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};
