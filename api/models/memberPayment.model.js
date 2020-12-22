const mongoose = require("../services/mongoose.service").mongoose;

let { Schema } = mongoose;
const opts = {
  toJSON: {
    virtuals: true, //this adds the "id" field
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id; //since id is added, this _id is not required

      delete ret.createdAt;
      delete ret.updatedAt;
    },
  },
  timestamps: true,
};

let memberPaymentSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    dueFor: Date,
    overdueFor: [{ type: Schema.Types.Date }],
    lastPaidFor: Date,
    prevTransactionDetails: [
      { type: Schema.Types.ObjectId, ref: "PaymentTransaction" },
    ],
  },
  opts
);

//refer : https://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose, if you want to control the collection name

let MemberPayment = mongoose.model("MemberPayment", memberPaymentSchema);

exports.insert = (memberPaymentData) => {
  let memberPayment = new MemberPayment(memberPaymentData);
  return memberPayment.save();
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
