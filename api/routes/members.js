const MembersController = require("../controllers/members.controller");
const ValidateMiddleware = require("../middlewares/validate.member.middleware");
const express = require("express");
const permission = require("../config/permission.config");
const membersRouter = express.Router();

membersRouter.get("/list", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.hasPermission({
    adminOnly: true,
    permission: permission.READ,
  }),
  MembersController.listAllMembers,
]);

membersRouter.get("/:memberId", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.hasPermission({
    adminOnly: false,
    permission: permission.READ,
  }),
  MembersController.getMember,
]);

membersRouter.post("/add", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.hasPermission({
    adminOnly: true,
    permission: permission.CREATE,
  }),
  ValidateMiddleware.doesUserAlreadyExist,
  MembersController.createMember,
]);
membersRouter.delete("/:memberId", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.hasPermission({
    adminOnly: true,
    permission: permission.DELETE,
  }),
  MembersController.deleteMember,
]);
membersRouter.patch("/:memberId", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.hasPermission({
    adminOnly: false,
    permission: permission.UPDATE,
  }),
  ValidateMiddleware.doesUserAlreadyExist,
  MembersController.updateMember,
]);
membersRouter.get("/health", [MembersController.health]);

membersRouter.post("/:memberId/payment", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.hasPermission({
    adminOnly: false,
    permission: permission.UPDATE,
  }),
  MembersController.handlePayment,
]);

module.exports = membersRouter;
