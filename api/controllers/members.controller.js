const MemberModel = require("../models/member.model");
const AdminMemberModel = require("../models/adminMember.model");
const MemberDetailsModel = require("../models/memberDetails.model");
const MemberPaymentModel = require("../models/memberPayment.model");
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
    .required()
    .allow("0"),
  password: Joi.string().min(5).max(25).allow(null, ""),
  revokeAccess: Joi.bool().required(),
  details: Joi.object({
    mobile: Joi.string()
      .allow("0")
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    anniversary: Joi.date().allow(null, ""),
    dob: Joi.date().allow(null, ""),
    altContact: Joi.string()
      .min(8)
      .max(14)
      .pattern(/^[0-9]+$/)
      .required()
      .allow("0"),
    land: Joi.string().valid("vacant", "built").required(),
    noOfFloors: Joi.string().when("land", {
      is: "built",
      then: Joi.string().valid("G", "G+1", "G+2", "G+3", "G+4").required(),
      otherwise: Joi.string().equal("NA"),
    }),
    bloodGroup: Joi.string()
      .valid("A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-", "UNKNOWN")
      .required(),
    monthlyMaintenance: Joi.bool().required(),
    maintenanceAmount: Joi.number().when("monthlyMaintenance", {
      is: true,
      then: Joi.number().valid(100, 300, 500).required(),
      otherwise: Joi.number().equal(-1),
    }),
    borewell: Joi.bool().required(),
    siteDimensions: Joi.string().valid("30x40", "40x60", "50x80").required(),
    address: Joi.string().min(4).max(30).required(),
    membershipStartDate: Joi.date().required(),
  }),
});

////////////////MEMBER CRUD OPERATIONS START//////////////////////

exports.createMember = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details });
  }
  if (!req.body.password) {
    req.body.password =
      req.body.siteNumber + req.body.firstName.toLowerCase().replace(/\s/g, "");
  }
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(req.body.password)
    .digest("base64");
  req.body.password = salt + "$" + hash;

  try {
    const adminMember = await AdminMemberModel.findByEmail(req.body.email);
    if (!adminMember) {
      req.body.permissionLevel = "0x00-0x06";
      req.body.npuf = [
        "email",
        "monthlyMaintenance",
        "maintenanceAmount",
        "membershipStartDate",
      ];
    } else {
      req.body.permissionLevel = `${adminMember.adminPermission}-${adminMember.selfPermission}`;
      req.body.npuf = [];
    }
    const createdMember = await MemberModel.insert(req.body);
    const membershipStartDate = new Date(req.body.details.membershipStartDate);
    const dueDate = new Date(
      membershipStartDate.setMonth(membershipStartDate.getMonth() + 1) // set due amount from the next month of start date
    );
    const paymentData = {
      memberId: createdMember._id,
      dueFor: dueDate,
      overdueFor: [],
      lastPaidFor: [],
    };
    await MemberPaymentModel.insert(paymentData);
    return res.status(201).send({ id: createdMember._id });
  } catch (err) {
    logger.error("Something went wrong while creating new member ", err);
    return res.status(500).send({
      error: [{ message: "Something went wrong: " + err }],
    });
  }
};

exports.updateMember = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details });
  } else {
    if (req.body.password) {
      let salt = crypto.randomBytes(16).toString("base64");
      let hash = crypto
        .createHmac("sha512", salt)
        .update(req.body.password)
        .digest("base64");
      req.body.password = salt + "$" + hash;
    } else {
      delete req.body.password;
    }
  }
  let toUpdateMemberId = req.params.memberId;
  MemberModel.update(toUpdateMemberId, req.body)
    .then(() =>
      res
        .status(200)
        .send({ msg: `User id: ${toUpdateMemberId} has been updated` })
    )
    .catch((err) => {
      let errorMsg = err.message;
      if (!errorMsg) {
        errorMsg = "Something went wrong while updating member";
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

function replacer(key, value) {
  if (typeof value === "boolean" || typeof value === "number") {
    return String(value);
  }
  return value;
}

exports.getMember = (req, res) => {
  MemberModel.findById(req.params.memberId)
    .then((foundMember) => {
      if (req.query.details) {
        if (req.query.details === "true") {
          MemberDetailsModel.findByMemberId(foundMember._id)
            .then((memberDetails) => {
              foundMember.mDetails.push(memberDetails);
              // this is done so that all json values 'appear' as strings so that the client can handle them wells
              const jsonString = JSON.parse(
                JSON.stringify(foundMember, replacer)
              );
              return res.status(200).send(jsonString);
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

////////////////MEMBER CRUD OPERATIONS END//////////////////////

////////////////META DATA START//////////////////////

exports.health = (req, res) => {
  return res.status(200).send({ msg: "ok" });
};

exports.memberCount = async (req, res) => {
  try {
    const memberCount = await MemberModel.getMemberCount();
    return res.status(200).send({ memberCount });
  } catch (err) {
    return res.status(500).send({
      error: [
        { message: "Something went wrong while fetching member count" + err },
      ],
    });
  }
};
////////////////META DATA END//////////////////////

////////////////MEMBER PAYMENT METHODS START//////////////////////

exports.updatePaymentInfo = async (req, res) => {
  try {
    req.body.memberId = req.params.memberId;
    await MemberPaymentModel.insert(req.body);
    return res
      .status(200)
      .send({ message: "Payment info updated successfully" });
  } catch {
    return res.status(500).send({
      error: [
        { message: "Something went wrong while updating member payment info" },
      ],
    });
  }
};

exports.getPaymentInfo = async (req, res) => {
  try {
    const MemberPaymentData = await MemberPaymentModel.findByMemberId(
      req.params.memberId
    );
    if (MemberPaymentData)
      return res.status(200).send({ data: MemberPaymentData });
    else
      return res.status(400).send({
        data: `No payment data found for member with id: ${req.params.memberId}`,
      });
  } catch (err) {
    return res.status(500).send({
      error: [
        {
          message:
            "Something went wrong while getting member payment info" + err,
        },
      ],
    });
  }
};

exports.shouldMemberPay = async (req, res) => {
  try {
    const MemberDetails = await MemberDetailsModel.findByMemberId(
      req.params.memberId
    );
    if (MemberDetails.monthlyMaintenance === false) {
      return res.status(200).send({ shouldMemberPay: false });
    } else {
      return res.status(200).send({ shouldMemberPay: true });
    }
  } catch (err) {
    return res.status(500).send({
      error: [
        {
          message: "Something went wrong while checking if member should pay",
        },
      ],
    });
  }
};

////////////////MEMBER PAYMENT METHODS END//////////////////////
