const jwt = require("jsonwebtoken");
const tokenConfig = require("../config/token.config");

const converBinToDec = (binaryInput) => {
  return parseInt(binaryInput, 2).toString(10);
};

exports.hasPermission = (requiredPermission) => (req, res, next) => {
  next();
};

exports.isValidJWTAccessToken = (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    let tokenFields = authHeader.split(" ");
    if (tokenFields[0] !== "Bearer") {
      res.status(401).send({
        error: [
          { type: "Unauthenticated member", message: "Invalid header value" },
        ],
      });
    } else {
      try {
        req.jwt = jwt.verify(tokenFields[1], tokenConfig.accessToken.secret);
        return next();
      } catch {
        res.status(401).send({
          error: [{ type: "Unauthenticated member", message: "Invalid token" }],
        });
      }
    }
  } else {
    res.status(401).send({
      error: [{ type: "Unauthenticated member", message: "No token found" }],
    });
  }
};
