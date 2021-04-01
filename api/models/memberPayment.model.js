const mongoose = require("../services/mongoose.service").mongoose;

let { Schema } = mongoose;
const opts = {
  autoIndex: true,
  toJSON: {
    virtuals: false, //this adds the "id" field
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
    memberId: { type: Schema.Types.ObjectId, unique: true, ref: "Member" },
    dueFor: Date,
    overdueFor: [{ type: Schema.Types.Date }],
    paidFor: [{ type: Schema.Types.Date }],
    // lastPaidFor: [
    //   {
    //     date: Date,
    //     transactionDetails: {
    //       type: Schema.Types.ObjectId,
    //       ref: "PaymentTransaction",
    //     },
    //   },
    // ],
    totalAmountDue: Number,
  },
  opts
);

//refer : https://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose, if you want to control the collection name

let MemberPayment = mongoose.model("MemberPayment", memberPaymentSchema);

exports.insert = (memberPaymentData) => {
  let memberPayment = new MemberPayment(memberPaymentData);
  return memberPayment.save();
};

exports.update = (memberId, newMemberPaymentData) => {
  return MemberPayment.findOneAndUpdate(
    { memberId: memberId },
    newMemberPaymentData
  );
};

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    MemberPayment.deleteMany({
      memberId: id,
    }).exec((err, deletedDetails) => {
      if (err) reject(err);
      else resolve(deletedDetails);
    });
  });
};

exports.deleteMany = (memberIds) => {
  return new Promise((resolve, reject) => {
    MemberPayment.deleteMany()
      .where("memberId")
      .in(memberIds)
      .exec((err, deletedPayments) => {
        if (err) reject(err);
        else resolve(deletedPayments);
      });
  });
};

exports.findByMemberId = (memberId) => {
  return MemberPayment.findOne({ memberId: memberId });
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    MemberPayment.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec((err, users) => {
        if (err) reject(err);
        else resolve(users);
      });
  });
};
