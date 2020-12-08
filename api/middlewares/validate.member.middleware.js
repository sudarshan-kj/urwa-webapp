const converBinToDec = (binaryInput) => {
  return parseInt(binaryInput, 2).toString(10);
};

exports.hasPermission = (requiredPermission) => (req, res, next) => {
  next();
};
