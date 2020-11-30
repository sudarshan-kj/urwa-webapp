const MembersController = require("../controllers/members.controller");
const express = require("express");
const membersRouter = express.Router();

membersRouter.post("", [MembersController.insert]);

module.exports = membersRouter;
