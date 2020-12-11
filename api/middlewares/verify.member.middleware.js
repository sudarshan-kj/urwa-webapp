const crypto = require("crypto");
const { Logger } = require("mongodb");
const MemberModel = require("../models/member.model");

exports.hasValidAuthFields = (req, res, next) => {
  const errors = [];
  if (req.body) {
    if (!req.body.userName) {
      errors.push("No userName entered");
    }
    if (!req.body.password) {
      errors.push("No password entered");
    } else {
      return next();
    }
  } else {
    errors.push("No valid credentials entered");
  }
  if (errors.length) {
    return res.status(400).send({ errors });
  }
};

exports.verifyUserAndPassword = (req, res, next) => {
  MemberModel.findByEmail(req.body.userName)
    .then((member) => {
      if (!member) {
        res.status(401).send({ error: "Invalid credentials" });
      } else {
        let passwordFields = member.password.split("$");
        let salt = passwordFields[0];
        let hash = crypto
          .createHmac("sha512", salt)
          .update(req.body.password)
          .digest("base64");
        if (hash === passwordFields[1]) {
          req.body = {
            memberId: member._id,
            email: member.email,
            permissionLevel: member.permissionLevel,
            firstName: member.firstName,
            lastName: member.lastName,
          };
          return next();
        } else {
          res.status(401).send({ error: "Invalid credentials" });
        }
      }
    })
    .catch((err) => {
      console.log("Error occurred", err);
      res.status(500).send({ error: "Something went wrong. Try again." });
    });
};
