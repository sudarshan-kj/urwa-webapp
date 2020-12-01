const express = require("express");
const authRouter = express.Router();
const VerifyMemberMiddleware = require("../middlewares/verify.member.middleware");
const AuthController = require("../controllers/authorization.controller");

authRouter.post("/login", [
  VerifyMemberMiddleware.hasValidAuthFields,
  VerifyMemberMiddleware.verifyUserAndPassword,
  AuthController.login,
]);

module.exports = authRouter;
