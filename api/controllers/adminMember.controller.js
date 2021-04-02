const MemberModel = require("../models/member.model");
const logger = require("log4js").getLogger();
const Joi = require("joi");
logger.level = "debug";

const schema = Joi.object({
  email: Joi.string().email().required(),
  adminPermission: Joi.string().length(4).required(),
  selfPermission: Joi.string().length(4).required(),
});

exports.createAdminMember = (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details });
  }
  MemberModel.updateByEmailId(req.body.email, {
    permissionLevel: `${req.body.adminPermission}-${req.body.selfPermission}`,
  })
    .then(() => res.status(201).send({ msg: "Admin member created" }))
    .catch((err) =>
      res.status(500).send({
        error: [
          {
            message: "Something went wrong while creating new admin member",
            err,
          },
        ],
      })
    );
};

exports.deleteAdminMember = (req, res) => {
  MemberModel.updateByEmailId(req.body.email, {
    permissionLevel: "0x00-0x06",
  })
    .then(() => res.status(200).send({ msg: "ok" }))
    .catch((err) =>
      res.status(500).send({
        error: [
          {
            message: "Something went wrong while deleting admin member",
            err,
          },
        ],
      })
    );
};

exports.updateMemberToAdmin = async (req, res) => {};
