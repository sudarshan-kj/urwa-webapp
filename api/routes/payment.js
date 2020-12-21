const PaymentController = require("../controllers/payment.controller");
const express = require("express");
const paymentRouter = express.Router();

paymentRouter.post("/hash/generate", [PaymentController.generateHash]);
paymentRouter.post("/hash/verify", [PaymentController.verifyHash]);
paymentRouter.post("/subscription/:memberId", [PaymentController.payAmount]);

module.exports = paymentRouter;
