const converBinToDec = (binaryInput) => {
  return parseInt(binaryInput, 2).toString(10);
};

exports.hasPermission = (requiredPermission) => (req, res, next) => {
  const memberPermissionDecimal = convertBinToDec(req.jwt.permissionLevel);
  const requiredPermissionDecimal = converBinToDec(requiredPermission);
  console.log("Member permission in decimal is", memberPermission);
  if (memberPermissionDecimal & requiredPermissionDecimal) {
  }
};
