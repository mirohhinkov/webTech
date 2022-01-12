const AppError = require("../utils/AppError");

const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const prodError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).render("error", {
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).render("error", {
      status: "error",
      message: "Something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    devError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    prodError(new AppError(err.message, err.statusCode), res);
  }
};
