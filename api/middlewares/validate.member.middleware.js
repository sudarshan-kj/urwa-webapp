const jwt = require("jsonwebtoken");
const tokenConfig = require("../config/token.config");
const MemberModel = require("../models/member.model");
const MemberDetailsModel = require("../models/memberDetails.model");
const log4j = require("log4js");
const logger = log4j.getLogger();
logger.level = "debug";

exports.isValidJWTAccessToken = (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    let tokenFields = authHeader.split(" ");
    if (tokenFields[0] !== "Bearer") {
      res.status(401).send({
        error: [
          { type: "Unauthenticated member", message: "Invalid header value" },
        ],
      });
    } else {
      try {
        req.jwt = jwt.verify(tokenFields[1], tokenConfig.accessToken.secret);
        return next();
      } catch {
        res.status(401).send({
          error: [{ type: "Unauthenticated member", message: "Invalid token" }],
        });
      }
    }
  } else {
    return res.status(401).send({
      error: [{ type: "Unauthenticated member", message: "No token found" }],
    });
  }
};

exports.hasPermission = ({ permission, adminOnly }) => (req, res, next) => {
  const memberPermission = req.jwt.permissionLevel.split("-");
  const selfPermission = memberPermission[1];
  const adminPermission = memberPermission[0];
  if (adminOnly) {
    if (permission & adminPermission) {
      return next();
    }
  } else {
    if (permission & adminPermission) {
      return next();
    } else if (permission & selfPermission) {
      if (req.params.memberId) {
        if (req.jwt.memberId === req.params.memberId) {
          return next();
        }
      } else {
        return next();
      }
    }
  }
  return res.status(403).send({
    error: [
      {
        type: "Unauthorized user",
        message: `You do not have necessary permissions to perform operation: ${permission}`,
      },
    ],
  });
};

exports.checkFieldPermissionToUpdate = async (req, res, next) => {
  const noPermissionToUpdateFields = req.jwt.npuf;
  if (noPermissionToUpdateFields && noPermissionToUpdateFields.length) {
    try {
      let member = await MemberModel.findById(req.params.memberId);
      let memberDetails = await MemberDetailsModel.findByMemberId(
        req.params.memberId
      );
      noPermissionToUpdateFields.forEach((element) => {
        logger.debug(`Auto updating field ${element}`);
        if (element === "email") req.body.email = member.email;
        else req.body.details[`${element}`] = memberDetails[`${element}`];
      });
      return next();
    } catch {
      return res.status(500).send({
        error: [
          { message: "Something went wrong while checking field permission" },
        ],
      });
    }
  } else {
    return next();
  }
};

exports.isValidMemberId = async (req, res, next) => {
  try {
    await MemberModel.findById(req.params.memberId);
    return next();
  } catch {
    logger.error(`Invalid member id: ${req.params.memberId}`);
    return res.status(400).send({
      error: [{ message: `Invalid member id` }],
    });
  }
};

exports.doesUserEmailAlreadyExist = async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  try {
    const foundMember = await MemberModel.findByEmail(req.body.email);
    if (foundMember) {
      if (req.params.memberId) {
        const requestingMember = await MemberModel.findById(
          req.params.memberId
        );
        if (requestingMember.email === foundMember.email) {
          return next();
        }
      }
      return res.status(409).send({
        error: [
          {
            message: `User with email: ${req.body.email} already exists`,
          },
        ],
      });
    } else {
      return next();
    }
  } catch (err) {
    console.error("Error while checking if email already exists", err);
    return res.status(500).send({
      error: [
        {
          message: `Something went wrong while checking if email already exists`,
        },
      ],
    });
  }
};

exports.doesSiteNumberAlreadyExist = async (req, res, next) => {
  try {
    const foundMember = await MemberModel.findBySiteNumber(req.body.siteNumber);
    if (foundMember) {
      if (req.params.memberId) {
        const requestingMember = await MemberModel.findById(
          req.params.memberId
        );
        if (requestingMember.siteNumber === foundMember.siteNumber) {
          return next();
        }
      }
      return res.status(409).send({
        error: [
          {
            message: `User with site number: ${req.body.siteNumber} already exists`,
          },
        ],
      });
    } else {
      return next();
    }
  } catch (err) {
    console.error("Error while checking if site number already exists", err);
    return res.status(500).send({
      error: [
        {
          message: `Something went wrong while checking if site already exists`,
        },
      ],
    });
  }
};
