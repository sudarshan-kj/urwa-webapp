const config = require("..config/token.config.js");
const jwt = require("jsonwebtoken");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

exports.login = (req, res) => {
  try {
    let accessToken = jwt.sign(
      req.body,
      config.accessToken.secret,
      config.accessToken.exp
    );

    let refreshToken = jwt.sign(
      { userId: req.body.userId },
      config.refreshToken.secret,
      config.refreshToken.exp
    );
    res.send(201).send({ accessToken, refreshToken });
  } catch (err) {
    logger.error(
      `Failed to generate tokens for userId: ${req.body.userId}. Error: ${err}`
    );
    res.send(500).send({ msg: "Failed to generate tokens" });
  }
};

exports.refreshLogin = (req, res) => {
  try {
    let accessToken = jwt.sign(req.body);
    res.send(201).send({ accessToken });
  } catch (err) {
    logger.err(
      `Failed to generate refresh token for userId: ${req.body.userId}. Error: ${err}`
    );
    res.send(500).send({ msg: "Failed to generate refresh token" });
  }
};
