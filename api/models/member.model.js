const mongoose = require("../services/mongoose.service").mongoose;
const MemberDetailsModel = require("./memberDetails.model");
const MemberPaymentModel = require("./memberPayment.model");

let { Schema } = mongoose;
const opts = {
  autoIndex: true,
  toJSON: {
    virtuals: true, //this adds the "id" field
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id; //since id is added, this _id is not required
      delete ret.password;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.npuf;
      delete ret.permissionLevel;
    },
  },
  timestamps: true,
};

let memberSchema = new Schema(
  {
    firstName: { type: String, unique: false, required: true },
    lastName: { type: String, unique: false, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: false, required: true },
    siteNumber: { type: Number, unique: false, required: true },
    doorNumber: { type: String, unique: false, required: false },
    permissionLevel: { type: String, unique: false, required: true },
    npuf: { type: Array, unique: false, required: true },
    revokeAccess: { type: Boolean, unique: false, required: true },
    isAdmin: { type: Boolean, default: false },
    memberDetails: {
      mobile: Number,
      altContact: Number,
      anniversary: Date,
      dob: Date,
      land: String,
      noOfFloors: String,
      bloodGroup: String,
      monthlyMaintenance: Boolean,
      maintenanceAmount: Number,
      borewell: Boolean,
      siteDimensions: String,
      siteAddress: String,
      tenantResiding: Boolean,
      ownerAddress: String,
      membershipStartDate: Date,
      subscriptionStartDate: Date,
    },
  },
  opts
);

//refer : https://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose, if you want to control the collection name

memberSchema.index({ siteNumber: 1, doorNumber: 1 }, { unique: true });
let Member = mongoose.model("Member", memberSchema);

exports.insert = (memberData) => {
  let member = new Member(memberData);
  return member.save();
};

exports.delete = (memberId) => {
  return new Promise((resolve, reject) => {
    Member.deleteMany({ _id: memberId }).exec((err, deletedMember) => {
      if (err) reject(err);
      else resolve(deletedMember);
    });
  });
};

exports.deleteMany = (memberIds) => {
  return new Promise((resolve, reject) => {
    Member.deleteMany()
      .where("_id")
      .in(memberIds)
      .exec((err, deletedMembers) => {
        if (err) reject(err);
        else {
          MemberPaymentModel.deleteMany(memberIds)
            .then((deletedMemberPayments) =>
              resolve({
                deletedMembers,
                deletedMemberPayments,
              })
            )
            .catch((err) => reject(err));
        }
      });
  });
};

exports.findByEmail = (value) => {
  return Member.findOne({ email: value });
};

exports.findBySiteNumber = (value) => {
  return Member.findOne({ siteNumber: value });
};

exports.findBySiteAndDoorNumber = (siteNumber, doorNumber) => {
  return Member.findOne().and([
    { siteNumber: siteNumber },
    { doorNumber: doorNumber },
  ]);
};

exports.findById = (memberId) => {
  return Member.findById({ _id: memberId });
};

exports.update = (memberId, newValues) => {
  return Member.findByIdAndUpdate({ _id: memberId }, newValues);
};

exports.updateByEmailId = (email, newValues) => {
  return Member.updateOne({ email: email }, newValues).exec();
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Member.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec((err, users) => {
        if (err) reject(err);
        else resolve(users);
      });
  });
};

exports.getMemberCount = () => {
  return Member.countDocuments();
};
