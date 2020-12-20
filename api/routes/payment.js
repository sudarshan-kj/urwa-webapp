const PaymentController = require("../controllers/payment.controller");
const express = require("express");
const paymentRouter = express.Router();

paymentRouter.post("/subscription/:memberId", [PaymentController.payAmount]);

module.exports = paymentRouter;
