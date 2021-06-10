const MemberModel = require("../models/member.model");
const MemberPaymentModel = require("../models/memberPayment.model");
const crypto = require("crypto");
const logger = require("log4js").getLogger();
logger.level = "debug";
const helperUtils = require("../helpers/helper.utils");
const addMemberValidatorSchema = require("../validators/addMember.validator.schema");
const response = require("../contracts/response");

function createOrUpdateErrorMsg(res, err, msg) {
  if (err.code) {
    if (err.code === 11000) {
      return response.conflict(
        res,
        `Duplicate key: ${JSON.stringify(err.keyValue)}`,
        err
      );
    }
  }
  return response.internalError(res, msg, err);
}

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
    const adminMember = req.body.isAdmin;
    if (!adminMember) {
      req.body.permissionLevel = "0x00-0x06";
      req.body.npuf = [
        "email",
        "monthlyMaintenance",
        "maintenanceAmount",
        "membershipStartDate",
        "subscriptionStartDate",
      ];
    } else {
      req.body.permissionLevel = "0x0F-0x0F";
      req.body.npuf = [];
    }
    const createdMember = await MemberModel.insert(req.body);
    let openingBalance = req.body.memberDetails.openingBalance;
    if (openingBalance > 0) {
      openingBalance = 0;
    } else {
      openingBalance = Math.abs(openingBalance);
    }
    if (req.body.memberDetails.monthlyMaintenance) {
      let { dueFor, paidArray, overDueArray } =
        helperUtils.computeDuesAndAdvances(req.body.memberDetails);
      const paymentData = {
        memberId: createdMember._id,
        dueFor: dueFor,
        overdueFor: overDueArray,
        paidFor: paidArray,
        totalAmountDue: openingBalance,
      };
      await MemberPaymentModel.insert(paymentData);
    }
    logger.info("Created new member with id: ", createdMember._id);
    return res.status(201).send({ id: createdMember._id });
  } catch (err) {
    return createOrUpdateErrorMsg(
      res,
      err,
      "Something went wrong while creating new member"
    );
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
  try {
    await MemberModel.update(toUpdateMemberId, req.body);
    return res
      .status(200)
      .send({ msg: `User id: ${toUpdateMemberId} has been updated` });
  } catch (err) {
    return createOrUpdateErrorMsg(
      res,
      err,
      "Something went wrong while updating existing member"
    );
  }
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
      return response.internalError(
        res,
        "Something went wrong while deleteing member",
        err
      );
    });
};

exports.deleteManyMembers = async (req, res) => {
  if (req.body.memberIds)
    try {
      const deleted = await MemberModel.deleteMany(req.body.memberIds);
      return response.ok(
        res,
        {
          memberCount: deleted.deletedMembers.deletedCount,
          memberPaymentsCount: deleted.deletedMemberPayments.deletedCount,
        },
        "Deleted members"
      );
    } catch (err) {
      response.internalError(
        res,
        "Something went wrong while deleting many members",
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
      perPageLimit = perPageLimit <= 50 ? perPageLimit : 50;
      let admins;
      if (req.query.showAdminsAlso === "1") {
        admins = await AdminMemberModel.list(perPageLimit, page);
        admins = JSON.parse(JSON.stringify(admins));
        MemberModel.list(perPageLimit, page)
          .then((users) => {
            users = JSON.parse(JSON.stringify(users));
            let joined = helperUtils.joinArrays(
              users,
              admins,
              "email",
              "email"
            );
            return res.status(200).send(joined);
          })
          .catch((err) => res.status(500).send({ error: [{ message: err }] }));
      } else
        MemberModel.list(perPageLimit, page)
          .then((users) => {
            return res.status(200).send(users);
          })
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
  if (typeof value === "number") {
    return String(value);
  }
  return value;
}

exports.getMember = (req, res) => {
  MemberModel.findById(req.params.memberId)
    .then((foundMember) => {
      if (foundMember) {
        if (req.query.details) {
          if (req.query.details === "true") {
            const jsonString = JSON.parse(
              JSON.stringify(foundMember, replacer)
            );
            return response.ok(
              res,
              jsonString,
              `Fetched member: ${foundMember._id} details`
            );
          } else {
            return response.badRequest(
              res,
              "Invalid value found for query param. Must be true or the query param must not be present"
            );
          }
        } else {
          let clonedFoundMember = Object.create(foundMember);
          const jsonString = JSON.parse(
            JSON.stringify(clonedFoundMember, replacer)
          );
          delete jsonString.memberDetails;
          return response.ok(
            res,
            jsonString,
            `Fetched member: ${foundMember._id} details`
          );
        }
      } else {
        return response.badRequest(
          res,
          `Member: ${req.params.memberId} does not exist`
        );
      }
    })
    .catch((err) =>
      response.internalError(
        res,
        `Something went wrong while fetching member: ${req.params.memberId} details`,
        err
      )
    );
};

////////////////MEMBER CRUD OPERATIONS END//////////////////////

////////////////META DATA START//////////////////////

exports.health = (req, res) => {
  return res.status(200).send({ msg: "ok" });
};

exports.memberMetaData = async (req, res) => {
  try {
    const memberCount = await MemberModel.getMemberCount();
    const { memberDetails } = await MemberModel.findById(req.params.memberId);

    return response.ok(
      res,
      {
        memberCount,
        maintenanceAmount: memberDetails.maintenanceAmount,
      },
      "Fetched member meta data"
    );
  } catch (err) {
    return response.internalError(
      res,
      "Something went wrong while fetching member meta data",
      err
    );
  }
};

////////////////META DATA END//////////////////////

////////////////MEMBER PAYMENT METHODS START//////////////////////

exports.updatePaymentInfo = async (req, res) => {
  try {
    let memberId = req.params.memberId;
    await MemberPaymentModel.update(memberId, req.body);
    return res
      .status(200)
      .send({ message: "Payment info updated successfully" });
  } catch (error) {
    console.log("Error occurred while updating member payment info", error);
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
      perPageLimit = perPageLimit <= 50 ? perPageLimit : 50;
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
    const { memberDetails } = await MemberModel.findById(req.params.memberId);
    if (memberDetails.monthlyMaintenance === false) {
      return res.status(200).send({ shouldMemberPay: false });
    } else {
      return res.status(200).send({ shouldMemberPay: true });
    }
  } catch (err) {
    return response.internalError(
      res,
      "Something went wrong while checking if member should pay",
      err
    );
  }
};

////////////////MEMBER PAYMENT METHODS END//////////////////////
