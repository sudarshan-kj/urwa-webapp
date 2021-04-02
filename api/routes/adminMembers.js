const AdminMembersController = require("../controllers/adminMember.controller");
const ValidateMiddleware = require("../middlewares/validate.member.middleware");
const express = require("express");
const permission = require("../config/permission.config");
const membersRouter = express.Router();

membersRouter.post("/add", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.hasPermission({
    adminOnly: true,
    permission: permission.CREATE,
  }),
  AdminMembersController.createAdminMember,
]);
membersRouter.delete("", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.hasPermission({
    adminOnly: true,
    permission: permission.DELETE,
  }),
  AdminMembersController.deleteAdminMember,
]);
membersRouter.patch("", [
  ValidateMiddleware.isValidJWTAccessToken,
  ValidateMiddleware.hasPermission({
    adminOnly: true,
    permission: permission.UPDATE,
  }),
  AdminMembersController.updateMemberToAdmin,
]);

module.exports = membersRouter;
