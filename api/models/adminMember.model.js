const mongoose = require("../services/mongoose.service").mongoose;

let { Schema } = mongoose;
const opts = {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  },
  timestamps: true,
};

let adminMemberSchema = new Schema(
  {
    email: String,
    adminPermission: String,
    selfPermission: String,
  },
  opts
);

let AdminMember = mongoose.model("AdminMember", adminMemberSchema);

exports.insert = (adminMember) => {
  const memberDetails = new AdminMember(adminMember);
  return memberDetails.save();
};

exports.delete = (email) => {
  return AdminMember.deleteMany({ email: email }).exec();
};

exports.findByEmail = (email) => {
  return AdminMember.findOne({ email: email });
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    AdminMember.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec((err, admins) => {
        if (err) reject(err);
        else resolve(admins);
      });
  });
};
