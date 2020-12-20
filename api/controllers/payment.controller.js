const MemberModel = require("../models/member.model");
const PaymentTransactionModel = require("../models/paymentTransaction.model");
const crypto = require("crypto");
const logger = require("log4js").getLogger();
const Joi = require("joi");
logger.level = "debug";

exports.payAmount = (req, res) => {
  res.status(200).send({ message: "Payment is successful" });
};
