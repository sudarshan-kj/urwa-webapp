const MemberModel = require("../models/member.model");
const MemberDetailsModel = require("../models/memberDetails.model");
const MemberPaymentModel = require("../models/memberPayment.model");
const PaymentTransactionModel = require("../models/paymentTransaction.model");
const crypto = require("crypto");
const logger = require("log4js").getLogger();
const Joi = require("joi");
logger.level = "debug";

exports.payAmount = async (req, res) => {
  try {
    const member = await MemberModel.findById(req.params.memberId);
    const memberDetails = await MemberDetailsModel.findByMemberId(memberId);
    const currentPaymentStatus = await MemberPaymentModel.findByMemberId(
      req.params.memberId
    );
    req.body.name = member.firstName + " " + member.lastName;
    req.body.email = member.email;
    let maintenanceAmount = memberDetails.maintenanceAmount;

    let overDueAmount =
      currentPaymentStatus.overdueFor.length * maintenanceAmount;
    let payingForMonths = req.body.amount / maintenanceAmount;
    currentPaymentStatus.overdueFor.splice(0, payingForMonths); // this ensures that the residual array contains whatever is not spliced
    let updatedTotalAmountDue =
      currentPaymentStatus.totalAmountDue - req.body.amount;

    const paid = await PaymentTransactionModel.insert(req.body);
    const updatedMemberData = {
      dueFor: "2021-03-22",
      overdueFor: currentPaymentStatus.overdueFor,
      lastPaidFor: [paid._id, ...currentPaymentStatus.lastPaidFor],
      totalAmountDue: updatedTotalAmountDue,
    };
    await MemberPaymentModel.update(req.params.memberId, updatedMemberData);

    // First, get the data for that member id and check what is due and what is not.
    // Second, depending on the paying for amount, check what needs to be updated on on the DB

    if (paid) {
      return res.status(200).send({ message: "Payment successful" });
    } else {
      return res.status(400).send({ error: "Could not capture payment data" });
    }
  } catch {
    return res
      .status(500)
      .send({ error: "Something went wrong while paying amount" });
  }
};

exports.generateHash = async (req, res) => {
  const memberId = req.params.memberId;
  const key = process.env.PAYU_KEY;
  const payu_salt = process.env.PAYU_SALT;
  const txnid = "ORD-" + Math.floor(Math.random() * 1000) + "-" + Date.now();
  let email, amount, phone, firstname;

  try {
    const member = await MemberModel.findById(memberId);
    const memberDetails = await MemberDetailsModel.findByMemberId(memberId);
    email = member.email;
    amount = memberDetails.maintenanceAmount / 1000;
    phone = memberDetails.mobile;
    firstname = member.firstName + "/" + member.lastName;
  } catch {}

  const productinfo = "URWA_SUBSCRIPTION";
  const udf5 = "URWA_PAYMENT_UDF5";
  const surl = "https://google.com";
  const furl = "https://google.com";
  let cryp = crypto.createHash("sha512");
  let text =
    key +
    "|" +
    txnid +
    "|" +
    amount +
    "|" +
    productinfo +
    "|" +
    firstname +
    "|" +
    email +
    "|||||" +
    udf5 +
    "||||||" +
    payu_salt;
  cryp.update(text);
  let hash = cryp.digest("hex");
  return res.status(200).send({
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    hash,
    email,
    phone,
    udf5,
    txnid,
    surl,
    furl,
    service_provider: "payu_paisa",
  });
};

exports.verifyHash = (req, res) => {
  const payu_key = process.env.PAYU_KEY;
  const payu_salt = process.env.PAYU_SALT;
  const udf5 = "URWA_PAYMENT_UDF5";

  const txnid = req.body.txnid;
  const amount = req.body.amount;
  const productinfo = req.body.productinfo;
  const firstname = req.body.firstname;
  const email = req.body.email;
  const status = req.body.status;
  const resphash = req.body.hash;

  var keyString =
    payu_key +
    "|" +
    txnid +
    "|" +
    amount +
    "|" +
    productinfo +
    "|" +
    firstname +
    "|" +
    email +
    "|||||" +
    udf5 +
    "|||||";
  let keyArray = keyString.split("|");
  let reverseKeyArray = keyArray.reverse();
  let reverseKeyString =
    payu_salt + "|" + status + "|" + reverseKeyArray.join("|");

  let cryp = crypto.createHash("sha512");
  cryp.update(reverseKeyString);
  let calchash = cryp.digest("hex");

  if (calchash == resphash) {
    return res.status(200).send({ message: "Transaction successful" });
  }
  return res
    .status(424)
    .send({ message: "Payment failed. Hash verification unsuccessful" });
};
