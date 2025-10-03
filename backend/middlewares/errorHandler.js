import config from "../config/index.js";

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    params: err.params,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Algo ha fallado en el servidor.",
    });
  }
};

export default (err, req, res, next) => {
  if (config.production) {
    sendErrorProd(err, res);
  } else {
    sendErrorDev(err, res);
  }
};
