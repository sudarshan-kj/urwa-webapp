exports.internalError = (
  res,
  errorMessage = "Internal Server Error",
  errObject = {}
) => {
  return res.status(500).send({
    status: "INTERNAL_SERVER_ERROR",
    message: errorMessage,
    data: errObject,
  });
};

exports.badRequest = (
  res,
  errorMessage = "Invalid / No data provided",
  errObject = {}
) => {
  return res
    .status(400)
    .send({ status: "BAD_REQUEST", message: errorMessage, data: errObject });
};

exports.ok = (
  res,
  successMessage = "Request fulfilled successfully",
  dataObject = {}
) => {
  return res
    .status(200)
    .send({ status: "OK", message: successMessage, data: dataObject });
};
