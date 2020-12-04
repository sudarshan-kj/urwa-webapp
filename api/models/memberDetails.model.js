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

let memberDetailsSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
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
    address: String,
  },
  opts
);

let MemberDetails = mongoose.model("MemberDetails", memberDetailsSchema);

exports.insert = (memberDetailsData) => {
  const memberDetails = new MemberDetails(memberDetailsData);
  return memberDetails.save();
};

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    MemberDetails.deleteMany({
      memberId: id,
    }).exec((err, deletedDetails) => {
      if (err) reject(err);
      else resolve(deletedDetails);
    });
  });
};
