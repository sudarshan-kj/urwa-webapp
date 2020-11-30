const mongoose = require("../../common/services/mongoose.service").mongoose;

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

    password: { type: String, unique: false, required: true },
    permissionLevel: Number,
    revokeAccess: Boolean,
  },
  opts
);