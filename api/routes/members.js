const MembersController = require("../controllers/members.controller");
const ValidateMiddleware = require("../middlewares/validate.member.middleware");
const express = require("express");
const permission = require("../config/permission.config");
const membersRouter = express.Router();

membersRouter.post("/add", [
  ValidateMiddleware.hasPermission(permission.CREATE),
  MembersController.createMember,
]);
membersRouter.delete("/:memberId", [
  ValidateMiddleware.hasPermission(permission.DELETE),
  MembersController.deleteMember,
]);
membersRouter.patch(":/memberId", [
  ValidateMiddleware.hasPermission(permission.UPDATE),
  MembersController.updateMember,
]);
membersRouter.get("/health", [MembersController.health]);

module.exports = membersRouter;
