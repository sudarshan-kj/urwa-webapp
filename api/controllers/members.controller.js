const MemberModel = require("../models/member.model");

exports.createMember = (req, res) => {
  MemberModel.insert(req.body)
    .then((result) => {
      res.status(201).send({ id: result._id });
    })
    .catch((err) => res.status(400).send({ errors: err }));
};

exports.updateMember = (req, res) => {};

exports.deleteMember = (req, res) => {};

exports.listAllMembers = (req, res) => {};

exports.getMember = (req, res) => {};

exports.insert = (req, res) => {
  res.status(200).send({ msg: "ok" });
};
