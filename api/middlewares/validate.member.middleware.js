const jwt = require("jsonwebtoken");
const tokenConfig = require("../config/token.config");
const MemberModel = require("../models/member.model");

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
    return res.status(401).send({
      error: [{ type: "Unauthenticated member", message: "No token found" }],
    });
  }
};

exports.hasPermission = ({ permission, adminOnly }) => (req, res, next) => {
  const memberPermission = req.jwt.permissionLevel.split("-");
  const selfPermission = memberPermission[1];
  const adminPermission = memberPermission[0];
  if (adminOnly) {
    if (permission & adminPermission) {
      return next();
    }
  } else {
    if (permission & adminPermission) {
      return next();
    } else if (permission & selfPermission) {
      if (req.params.memberId) {
        if (req.jwt.memberId === req.params.memberId) {
          return next();
        }
      } else {
        return next();
      }
    }
  }
  return res.status(403).send({
    error: [
      {
        type: "Unauthorized user",
        messsage: `You do not have necessary permissions to perform operation: ${permission}`,
      },
    ],
  });
};

exports.doesUserEmailAlreadyExist = (req, res, next) => {
  MemberModel.findByEmail(req.body.email)
    .then((member) => {
      if (member) {
        return res.status(409).send({
          error: [
            { message: `User with email: ${req.body.email} already exists` },
          ],
        });
      } else {
        return next();
      }
    })
    .catch((err) => {
      console.err("Error occurred while checking if user already exists", err);
      return res
        .status(500)
        .send({ error: [{ message: "Something went wrong" }] });
    });
};

exports.doesSiteNumberAlreadyExist = (req, res, next) => {
  MemberModel.findBySiteNumber(req.body.siteNumber)
    .then((member) => {
      if (member) {
        return res.status(409).send({
          error: [
            {
              message: `User with site number: ${req.body.siteNumber} already exists`,
            },
          ],
        });
      } else {
        return next();
      }
    })
    .catch((err) => {
      console.err(
        "Error occurred while checking if user with site number already exists",
        err
      );
      return res
        .status(500)
        .send({ error: [{ message: "Something went wrong" }] });
    });
};
