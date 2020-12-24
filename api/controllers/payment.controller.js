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
    req.body.memberId = req.params.memberId;
    await PaymentTransactionModel.insert(req.body);
    return res.status(200).send({ message: "Payment successful" });
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
  const txnid = "ORD-" + Math.floor(Math.random() * 10000) + "-" + Date.now();
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

  console.log("calc hash", calchash);

  if (calchash == resphash) {
    return res.status(200).send({ message: "Transaction successful" });
  }
  return res
    .status(424)
    .send({ message: "Payment failed. Hash verification unsuccessful" });
};
