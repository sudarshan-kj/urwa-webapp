const MembersController = require("../controllers/members.controller");
const ValidateMiddleware = require("../middlewares/validate.member.middleware");
const express = require("express");
const permission = require("../config/permission.config");
const membersRouter = express.Router();

membersRouter.get("/health", [MembersController.health]);
membersRouter.get("/metaData/:memberId", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.isValidMemberId,
  MembersController.memberMetaData,
]);

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
  ValidateMiddleware.doesUserEmailAlreadyExist,
  ValidateMiddleware.doesSiteAndDoorNumberAlreadyExist,
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

membersRouter.delete("/delete/many", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.hasPermission({
    adminOnly: true,
    permission: permission.DELETE,
  }),
  MembersController.deleteManyMembers,
]);
membersRouter.patch("/:memberId", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.isValidMemberId,
  ValidateMiddleware.hasPermission({
    adminOnly: false,
    permission: permission.UPDATE,
  }),
  ValidateMiddleware.checkFieldPermissionToUpdate,
  ValidateMiddleware.doesUserEmailAlreadyExist,
  ValidateMiddleware.doesSiteAndDoorNumberAlreadyExist,
  MembersController.updateMember,
]);

membersRouter.patch("/payment/:memberId", [
  ValidateMiddleware.isValidMemberId,
  MembersController.updatePaymentInfo,
]);

membersRouter.get("/payments/all", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.hasPermission({
    adminOnly: true,
    permission: permission.READ,
  }),
  MembersController.getAllMembersPaymentInfo,
]);

membersRouter.get("/payment/:memberId", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.isValidMemberId,
  ValidateMiddleware.hasPermission({
    adminOnly: false,
    permission: permission.READ,
  }),
  MembersController.getPaymentInfo,
]);

membersRouter.get("/payment/check/:memberId", [
  ValidateMiddleware.isValidMemberId,
  MembersController.shouldMemberPay,
]);

module.exports = membersRouter;
