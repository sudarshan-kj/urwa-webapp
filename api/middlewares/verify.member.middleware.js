const crypto = require("crypto");
const MemberModel = require("../models/member.model");

exports.hasValidAuthFields = (req, res, next) => {
  const errors = [];
  if (req.body) {
    if (!req.body.userName) {
      errors.push("No username entered");
    }
    if (!req.body.password) {
      errors.push("No password entered");
    } else {
      next();
    }
  } else {
    errors.push("No valid credentials entered");
  }
  if (errors.length) {
    return res.status(400).send({ errors });
  }
};

exports.verifyUserAndPassword = (req, res, next) => {
  MemberModel.findByEmailOrSiteNumber(req.body.userName).then((member) => {
    if (!member) {
      res.status(401).send({ error: "Invalid credentials" });
    }
  });
};
