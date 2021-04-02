const jwt = require("jsonwebtoken");
const tokenConfig = require("../config/token.config");
const MemberModel = require("../models/member.model");
const MemberDetailsModel = require("../models/memberDetails.model");
const logger = require("log4js").getLogger();
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

/* The following method retrieves the actual information from database on fields that are marked as NPUF since the UI sends them as dummy values, 
and replaces the dummy values with actual values that should not be modified
Or instead you should not even send these values from ui, only send what has changed
*/

exports.checkFieldPermissionToUpdate = async (req, res, next) => {
  const noPermissionToUpdateFields = req.jwt.npuf;
  if (noPermissionToUpdateFields && noPermissionToUpdateFields.length) {
    try {
      let member = await MemberModel.findById(req.params.memberId);
      let memberDetails = member.memberDetails;
      noPermissionToUpdateFields.forEach((element) => {
        if (element === "email") req.body.email = member.email;
        else req.body.memberDetails[`${element}`] = memberDetails[`${element}`];
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

async function allowSelfOrAdminUpdate(fields, foundMember, req) {
  if (req.params.memberId) {
    // the above check indiactes it is an update
    try {
      const requestedForMember = await MemberModel.findById(
        req.params.memberId
      );
      //Note: We make sure that while admin/self is updating a member, he is not entering a field that already exists.
      for (let field of fields) {
        if (requestedForMember[field] !== foundMember[field]) {
          return false;
        }
      }
      return true;
    } catch (e) {
      console.error("Error was: ", e);
      throw new Error("Could not find requested for member");
    }
  }
  return false;
}

exports.doesUserEmailAlreadyExist = async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  try {
    const foundMember = await MemberModel.findByEmail(req.body.email);
    if (foundMember) {
      //Note: The following if condition exists only to check while updating, and not while creating
      if (await allowSelfOrAdminUpdate(["email"], foundMember, req)) {
        return next();
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

exports.doesSiteAndDoorNumberAlreadyExist = async (req, res, next) => {
  try {
    const foundMember = await MemberModel.findBySiteAndDoorNumber(
      req.body.siteNumber,
      req.body.doorNumber
    );
    if (foundMember) {
      //Note: The following if condition exists only to check while updating, and not while creating
      if (
        await allowSelfOrAdminUpdate(
          ["siteNumber", "doorNumber"],
          foundMember,
          req
        )
      ) {
        return next();
      }
      return res.status(409).send({
        error: [
          {
            message: `User with site number-door number: ${req.body.siteNumber}-${req.body.doorNumber} already exists`,
          },
        ],
      });
    } else {
      return next();
    }
  } catch (err) {
    console.error(
      "Error while checking if site number-door number already exists",
      err
    );
    return res.status(500).send({
      error: [
        {
          message: `Something went wrong while checking if site-door number already exists`,
        },
      ],
    });
  }
};
