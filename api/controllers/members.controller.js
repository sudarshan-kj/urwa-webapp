const MemberModel = require("../models/member.model");
const AdminMemberModel = require("../models/adminMember.model");
const MemberDetailsModel = require("../models/memberDetails.model");
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
  revokeAccess: Joi.bool().required(),
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
      otherwise: Joi.string().equal("NA"),
    }),
    bloodGroup: Joi.string()
      .valid("A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-")
      .required(),
    monthlyMaintenance: Joi.bool().required(),
    maintenanceAmount: Joi.number().when("monthlyMaintenance", {
      is: true,
      then: Joi.number().valid(300, 500).required(),
      otherwise: Joi.number().equal(-1),
    }),
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
  AdminMemberModel.findByEmail(req.body.email)
    .then((adminMember) => {
      if (!adminMember) {
        req.body.permissionLevel = "0x00-0x06";
      } else {
        req.body.permissionLevel = `${adminMember.adminPermission}-${adminMember.selfPermission}`;
      }
      MemberModel.insert(req.body)
        .then((result) => {
          res.status(201).send({ id: result._id });
        })
        .catch((err) => res.status(400).send({ errors: err }));
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ error: [{ message: "Somehting went wrong" }] });
    });
};

exports.updateMember = (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details });
  }
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
  }
  let toUpdateMemberId = req.params.memberId;
  req.body.permissionLevel = setPermissionLevel(req.body.email);
  MemberModel.update(toUpdateMemberId, req.body)
    .then(() =>
      res
        .status(200)
        .send({ msg: `User id: ${toUpdateMemberId} has been updated` })
    )
    .catch((err) => {
      let errorMsg = err.message;
      if (!errorMsg) {
        errorMsg = "Someting went wrong";
      }
      return res.status(500).send({
        errors: [{ type: "Internal error", message: errorMsg }],
      });
    });
};

//TODO: Delete admin member if any, when deleting this member
exports.deleteMember = (req, res) => {
  MemberModel.delete(req.params.memberId)
    .then(() =>
      res
        .status(200)
        .send({ msg: `Deleted member with id: ${req.params.memberId}` })
    )
    .catch((err) => logger.error("Error occurred while deleting", err));
};

const validateNumber = (value) => {
  if (!Number.isInteger(parseInt(value))) {
    throw new Error("Invalid data provided");
  }
};

exports.listAllMembers = (req, res) => {
  if (req.query.page && req.query.limit) {
    try {
      let page = validateNumber(req.query.page);
      let perPageLimit = validateNumber(req.query.limit);
      perPageLimit = perPageLimit <= 25 ? perPageLimit : 25;
      MemberModel.list(perPageLimit, page)
        .then((users) => res.status(200).send(users))
        .catch((err) => res.status(500).send({ error: [{ message: err }] }));
    } catch (err) {
      return res.status(400).send({ error: [{ message: err.message }] });
    }
  } else {
    return res.status(400).send({
      error: [{ message: "Missing 'limit' and/or 'page' query parameter" }],
    });
  }
};

exports.getMember = (req, res) => {
  MemberModel.findById(req.params.memberId)
    .then((foundMember) => {
      if (req.query.details) {
        if (req.query.details === "true") {
          MemberDetailsModel.findByMemberId(foundMember._id)
            .then((memberDetails) => {
              foundMember.mDetails.push(memberDetails);
              return res.status(200).send(foundMember);
            })
            .catch((err) => res.status(500).send({ error: err }));
        } else {
          return res.status(400).send({
            error: [
              {
                message:
                  "Invalid value found for query param. Must be true or the query param must not be present",
              },
            ],
          });
        }
      } else {
        return res.status(200).send(foundMember);
      }
    })
    .catch((err) => res.status(500).send({ error: [{ message: err }] }));
};

exports.health = (req, res) => {
  res.status(200).send({ msg: "ok" });
};
