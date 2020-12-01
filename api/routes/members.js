const MembersController = require("../controllers/members.controller");
const express = require("express");
const membersRouter = express.Router();

membersRouter.post("/add", [MembersController.createMember]);
membersRouter.delete("/:memberId", [MembersController.deleteMember]);
membersRouter.get("/health", [MembersController.health]);

module.exports = membersRouter;
