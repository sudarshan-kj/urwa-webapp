const mongoose = require("../services/mongoose.service").mongoose;

let { Schema } = mongoose;
const opts = {
  autoIndex: true,
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

let paymentTransactionSchema = new Schema(
  {
    amount: Number,
    name: String,
    email: String,
    payUTransactionId: String,
    status: String,
    type: {
      type: String,
      enum: ["donation", "monthly", "advance", "water", "others"],
      required: true,
    },
    paidOn: Date,
  },
  opts
);

//refer : https://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose, if you want to control the collection name

let PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  paymentTransactionSchema
);

exports.insert = (paymentData) => {
  let paymentTransaction = new PaymentTransaction(paymentData);
  return paymentTransaction.save();
};
