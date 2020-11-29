const UsersController = require("../controllers/usersController");
const express = require("express");
const usersRouter = express.Router();

usersRouter.post("", [UsersController.insert]);

module.exports = usersRouter;
