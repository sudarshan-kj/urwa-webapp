const logger = require("log4js").getLogger();
logger.level = "debug";

exports.internalError = (
  res,
  errorMessage = "Internal Server Error",
  errObject = {}
) => {
  let errObj = {
    status: "INTERNAL_SERVER_ERROR",
    message: errorMessage,
    data: errObject,
  };
  logger.error("ERROR: 500 ", errObj);
  return res.status(500).send(errObj);
};

exports.badRequest = (
  res,
  errorMessage = "Invalid / No data provided",
  errObject = {}
) => {
  let errObj = {
    status: "BAD_REQUEST",
    message: errorMessage,
    data: errObject,
  };
  logger.error("ERROR: 400", errObj);
  return res.status(400).send(errObj);
};

exports.conflict = (res, errorMessage = "Conflicting data", errObject = {}) => {
  let errObj = {
    status: "DATA_CONFLICT",
    message: errorMessage,
    data: errObject,
  };
  logger.error("ERROR: 429", errObj);
  return res.status(429).send(errObj);
};

exports.ok = (
  res,
  dataObject = {},
  successMessage = "Request fulfilled successfully"
) => {
  return res
    .status(200)
    .send({ status: "OK", message: successMessage, data: dataObject });
};
