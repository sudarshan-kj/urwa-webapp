const MemberModel = require("../models/member.model");
const AdminMemberModel = require("../models/adminMember.model");
const MemberDetailsModel = require("../models/memberDetails.model");
const MemberPaymentModel = require("../models/memberPayment.model");
const crypto = require("crypto");
const logger = require("log4js").getLogger();
const Joi = require("joi");
logger.level = "debug";
const helperUtils = require("../helpers/helper.utils");
const addMemberValidatorSchema = require("../validators/addMember.validator.schema");
const response = require("../contracts/response");

////////////////MEMBER CRUD OPERATIONS START//////////////////////

exports.createMember = async (req, res) => {
  const { error } = addMemberValidatorSchema.validate(req.body);
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
    const membershipStartDate = new Date(req.body.details.membershipStartDate);
    let overDueArray = helperUtils.generatePreviousOverDues(req.body.details);
    const createdMember = await MemberModel.insert(req.body);
    const paymentData = {
      memberId: createdMember._id,
      dueFor: membershipStartDate,
      overdueFor: overDueArray,
      lastPaidFor: [],
      totalAmountDue: req.body.details.openingBalance,
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
  const { error } = addMemberValidatorSchema.validate(req.body);
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
      delete req.body.password; //if blank passwords are sent, that is not be stored as is
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
    .then(() => MemberPaymentModel.delete(req.params.memberId))
    .then(() =>
      res
        .status(200)
        .send({ msg: `Deleted member with id: ${req.params.memberId}` })
    )
    .catch((err) => {
      logger.error("Error occurred while deleting", err);
      return res
        .status(500)
        .send({ error: "Something went wrong while deleteing member: " + err });
    });
};

exports.deleteManyMembers = async (req, res) => {
  if (req.body.memberIds)
    try {
      const deleted = await MemberModel.deleteMany(req.body.memberIds);
      response.ok(res, `Deleted documents`, {
        memberCount: deleted.deletedMembers.deletedCount,
        memberPaymentsCount: deleted.deletedMemberPayments.deletedCount,
      });
    } catch (err) {
      response.internalError(
        res,
        "Something went wrong while deleteing many members",
        err
      );
    }
  else response.badRequest(res);
};

exports.listAllMembers = async (req, res) => {
  if (req.query.page && req.query.limit) {
    try {
      let page = helperUtils.validateNumber(req.query.page);
      let perPageLimit = helperUtils.validateNumber(req.query.limit);
      perPageLimit = perPageLimit <= 25 ? perPageLimit : 25;
      if (req.query.showAdminsAlso === true) {
        const admins = await AdminMemberModel.list(perPageLimit, page);
        admins = JSON.parse(JSON.stringify(admins));
      }
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
              // this is done so that all json values 'appear' as strings so that the client can handle them well
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

exports.memberMetaData = async (req, res) => {
  try {
    const memberCount = await MemberModel.getMemberCount();
    const memberDetails = await MemberDetailsModel.findByMemberId(
      req.params.memberId
    );
    return res.status(200).send({
      memberCount,
      maintenanceAmount: memberDetails.maintenanceAmount,
    });
  } catch (err) {
    return res.status(500).send({
      error: [
        {
          message: "Something went wrong while fetching member meta data" + err,
        },
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

exports.getAllMembersPaymentInfo = async (req, res) => {
  if (req.query.page && req.query.limit) {
    try {
      let page = helperUtils.validateNumber(req.query.page);
      let perPageLimit = helperUtils.validateNumber(req.query.limit);
      perPageLimit = perPageLimit <= 25 ? perPageLimit : 25;
      let members = await MemberModel.list(perPageLimit, page);
      let membersPayments = await MemberPaymentModel.list(perPageLimit, page);
      members = JSON.parse(JSON.stringify(members));
      membersPayments = JSON.parse(JSON.stringify(membersPayments));
      let merged = helperUtils.mergeArrays(
        members,
        membersPayments,
        "memberId",
        "id"
      );
      return res.status(200).send(merged);
    } catch {
      return res.status(500).send({
        error: "Something went wrong while fetching members payment info",
      });
    }
  } else {
    return res.status(400).send({ error: "Invalid page or limit parameter" });
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
