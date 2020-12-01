const mongoose = require("../services/mongoose.service").mongoose;
const MemberDetailsModel = require("./memberDetails.model");

let { Schema } = mongoose;
const opts = {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.password;
      delete ret.permissionLevel;
      delete ret.revokeAccess;
    },
  },
};

let memberSchema = new Schema(
  {
    siteNumber: { type: String, unique: true, required: true },
    firstName: { type: String, unique: false, required: true },
    lastName: { type: String, unique: false, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: false, required: true },
    permissionLevel: { type: Number, unique: false, required: true },
    revokeAccess: { type: String, unique: false, required: true },
  },
  opts
);

let Member = mongoose.model("Member", memberSchema);

exports.insert = (memberData) => {
  let member = new Member(memberData);
  return member.save().then((result) => {
    memberData.details.member = result._id;
    return MemberDetailsModel.insert(memberData.details);
  });
};
