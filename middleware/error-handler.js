const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (customError.msg.startsWith("Cast to ObjectId")) {
    customError.msg = "please provide id with correct format";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (customError.msg.startsWith("List validation failed")) {
    customError.msg =
      "name must be longer than 3 char and shorter than 20 char";
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
