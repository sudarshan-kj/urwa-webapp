const PaymentController = require("../controllers/payment.controller");
const ValidateMiddleware = require("../middlewares/validate.member.middleware");
const express = require("express");
const paymentRouter = express.Router();

paymentRouter.post("/hash/generate/:memberId", [
  ValidateMiddleware.isValidMemberId,
  PaymentController.generateHash,
]);
paymentRouter.post("/hash/verify", [PaymentController.verifyHash]);
paymentRouter.post("/subscription/:memberId", [
  ValidateMiddleware.isValidMemberId,
  PaymentController.payAmount,
]);

module.exports = paymentRouter;
