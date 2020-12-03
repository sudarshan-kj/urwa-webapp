const MemberModel = require("../models/member.model");
const crypto = require("crypto");
const logger = require("log4js").getLogger();
const Joi = require("joi");
logger.level = "debug";

const schema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(1).max(300).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  siteNumber: Joi.string()
    .min(2)
    .max(5)
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string().min(5).max(20).required(),
  details: Joi.object({
    mobile: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    anniversary: Joi.date().required(),
    dob: Joi.date().required(),
    altContact: Joi.string()
      .min(8)
      .max(14)
      .pattern(/^[0-9]+$/)
      .required(),
    land: Joi.string().valid("vacant", "built").required(),
    noOfFloors: Joi.string().when("land", {
      is: "built",
      then: Joi.string().valid("G", "G+1", "G+2", "G+3", "G+4").required(),
    }),
    bloodGroup: Joi.string()
      .valid("A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-")
      .required(),
    maintenanceAmount: Joi.number().valid(300, 500).required(),
    borewell: Joi.bool().required(),
    siteDimensions: Joi.string().valid("30x40", "40x60", "50x80").required(),
    address: Joi.string().min(4).max(30).required(),
  }),
});

exports.createMember = (req, res) => {
  if (!req.body.password) {
    req.body.password =
      req.body.siteNumber + req.body.firstName.toLowerCase().replace(/\s/g, "");
  }
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(req.body.password)
    .digest("base64");

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details });
  }
  req.body.password = salt + "$" + hash;
  req.body.permissionLevel = 1;
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
