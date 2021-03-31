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
    const currentPaymentStatus = await MemberPaymentModel.findByMemberId(
      req.params.memberId
    );
    req.body.name = member.firstName + " / " + member.lastName;
    req.body.email = member.email;
    req.body.paidOn = new Date().toISOString().split("T")[0];

    let totalDueAmount = currentPaymentStatus.totalAmountDue;
    let payingAmount = Number(req.body.amount);
    let dueAmountPostPayment = totalDueAmount - payingAmount;

    const paid = await PaymentTransactionModel.insert(req.body);
    const updatedMemberData = {
      dueFor: "",
      overdueFor: "",
      paidFor: [
        currentPaymentStatus.dueFor,
        ...currentPaymentStatus.overdueFor,
        ...currentPaymentStatus.paidFor,
      ],
      totalAmountDue: dueAmountPostPayment,
    };
    await MemberPaymentModel.update(req.params.memberId, updatedMemberData);

    // First, get the data for that member id and check what is due and what is not.
    // Second, depending on the paying for amount, check what needs to be updated on on the DB

    if (paid) {
      return res.status(200).send({ message: "Payment successful" });
    } else {
      return res.status(400).send({ error: "Could not capture payment data" });
    }
  } catch (e) {
    console.log("Error is", e);
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
  const surl = "https://urwa.in";
  const furl = "https://urwa.in";
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

  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    status,
    hash,
  } = req.body;

  let keyString =
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
  if (calchash == hash) {
    return res.status(200).send({ message: "Transaction successful" });
  }
  return res
    .status(424)
    .send({ message: "Payment failed. Hash verification unsuccessful" });
};
