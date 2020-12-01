const config = require("../config/token.config.js");
const jwt = require("jsonwebtoken");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

exports.login = (req, res) => {
  try {
    let accessToken = jwt.sign(req.body, config.accessToken.secret, {
      expiresIn: config.accessToken.exp,
    });

    let refreshToken = jwt.sign(
      { memberId: req.body.memberId },
      config.refreshToken.secret,
      { expiresIn: config.refreshToken.exp }
    );
    res.status(201).send({ accessToken, refreshToken });
  } catch (err) {
    logger.error(
      `Failed to generate tokens for memberId: ${req.body.memberId}. Error: ${err}`
    );
    res.status(500).send({ msg: "Failed to generate tokens" });
  }
};

exports.refreshLogin = (req, res) => {
  try {
    let accessToken = jwt.sign(req.body);
    res.status(201).send({ accessToken });
  } catch (err) {
    logger.err(
      `Failed to generate refresh token for memberId: ${req.body.memberId}. Error: ${err}`
    );
    res.status(500).send({ msg: "Failed to generate refresh token" });
  }
};
