const mongoose = require("../services/mongoose.service").mongoose;
const MemberDetailsModel = require("./memberDetails.model");

let { Schema } = mongoose;
const opts = {
  toJSON: {
    virtuals: true, //this adds the "id" field
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id; //since id is added, this _id is not required
      delete ret.password;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  },
  timestamps: true,
};

let memberSchema = new Schema(
  {
    siteNumber: { type: Number, unique: false, required: true },
    firstName: { type: String, unique: false, required: true },
    lastName: { type: String, unique: false, required: true },
    email: { type: String, index: { unique: true }, required: true },
    password: { type: String, unique: false, required: true },
    permissionLevel: { type: String, unique: false, required: true },
    npuf: { type: Array, unique: false, required: true },
    revokeAccess: { type: Boolean, unique: false, required: true },
    mDetails: [{ type: Schema.Types.ObjectId, ref: "MemberDetails" }],
  },
  opts
);

//refer : https://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose, if you want to control the collection name

let Member = mongoose.model("Member", memberSchema);

exports.insert = (memberData) => {
  let member = new Member(memberData);
  return member.save().then((result) => {
    memberData.details.memberId = result._id;
    return MemberDetailsModel.insert(memberData.details).then(() => result._id);
  });
};

exports.delete = (memberId) => {
  return new Promise((resolve, reject) => {
    Member.deleteMany({ _id: memberId }).exec((err, deletedMember) => {
      if (err) reject(err);
      MemberDetailsModel.delete(memberId)
        .then((deletedMemberDetails) =>
          resolve({ deletedMember, deletedMemberDetails })
        )
        .catch((err) => reject(err));
    });
  });
};

exports.findByEmail = (value) => {
  return Member.findOne({ email: value });
};

exports.findBySiteNumber = (value) => {
  return Member.findOne({ siteNumber: value });
};

exports.findById = (memberId) => {
  return Member.findById({ _id: memberId });
};

exports.update = (memberId, newValues) => {
  let details = newValues.details;
  delete newValues.details;
  return Member.findByIdAndUpdate({ _id: memberId }, newValues).then(
    (updatedMember) => {
      if (!updatedMember) {
        throw new Error("User not found");
      }
      return MemberDetailsModel.update(memberId, details);
    }
  );
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
  return Member.count();
};
