const AppError = require('../utiltys/appError');

const HandleCastDB = (err) => {
  const message = `Invalid ${err.kind}: ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    //if error is trusted sent it to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //if error from code or unknown error : dont leak the details error
    console.error('ERR 💩', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went Above Wrong!',
    });
  }
};

const HandleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplikat value ${value}: . Tolong Gunakan nama lainnya`;
  return new AppError(message, 400);
};

const handleJWTerror = () =>
  new AppError('Invalid Token. Please re login.', 401);

const handleJWTExpiredError = () =>
  new AppError('Expired Token. Please re login.', 401);
const HandleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data. ${errors.join('.')}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    if (error.name === 'CastError') error = HandleCastDB(error);
    if (error.code === 11000) error = HandleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = HandleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTerror();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
