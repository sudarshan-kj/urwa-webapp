const mongoose = require("../../common/services/mongoose.service").mongoose;

let { Schema } = mongoose;
const opts = {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  },
};

let memberDetailsSchema = new Schema(
  {
    member: { type: Schema.Types.ObjectId, ref: "Member" },
    mobile: Number,
    altContact: Number,
    anniversary: String,
    land: String,
    noOfFloors: Number,
    bloodGroup: String,
    maintenanceAmount: Number,
    borewell: Boolean,
    siteDimensions: String,
    address: String,
    dob: String,
  },
  opts
);

let MemberDetails = mongoose.model("MemberDetails", memberDetailsSchema);

exports.insert = (memberDetailsData) => {
  const memberDetails = new MemberDetails(memberDetailsData);
  return memberDetails.save();
};
