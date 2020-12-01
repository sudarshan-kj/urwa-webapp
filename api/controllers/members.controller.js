const MemberModel = require("../models/member.model");
const crypto = require("crypto");
const logger = require("log4js").getLogger();
logger.level = "debug";

exports.createMember = (req, res) => {
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(req.body.password)
    .digest("base64");

  req.body.password = salt + "$" + hash;
  req.body.permissionLevel = 15;
  req.body.revokeAccess = false;
  MemberModel.insert(req.body)
    .then((result) => {
      res.status(201).send({ id: result._id });
    })
    .catch((err) => res.status(400).send({ errors: err }));
};

exports.updateMember = (req, res) => {};

exports.deleteMember = (req, res) => {
  MemberModel.delete(req.params.memberId)
    .then((result) => {
      return res
        .status(200)
        .send({ msg: `Deleted member with id: ${req.params.memberId}` });
    })
    .catch((err) => logger.error("Error occurred while deleting", err));
};

exports.listAllMembers = (req, res) => {};

exports.getMember = (req, res) => {};

exports.health = (req, res) => {
  res.status(200).send({ msg: "ok" });
};
