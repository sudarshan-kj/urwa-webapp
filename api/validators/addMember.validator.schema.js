const Joi = require("joi");

const schema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(1).max(300).required(),
  isAdmin: Joi.bool(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  siteNumber: Joi.string()
    .min(2)
    .max(5)
    .pattern(/^[0-9]+$/)
    .required()
    .allow("0"),
  doorNumber: Joi.string().min(1).max(10).allow(null, ""),
  password: Joi.string().min(5).max(25).allow(null, ""),
  revokeAccess: Joi.bool().required(),
  memberDetails: Joi.object({
    mobile: Joi.string()
      .allow("0")
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    anniversary: Joi.date().allow(null, ""),
    dob: Joi.date().allow(null, ""),
    altContact: Joi.string()
      .min(8)
      .max(14)
      .pattern(/^[0-9]+$/)
      .required()
      .allow("0"),
    land: Joi.string().valid("vacant", "built").required(),
    noOfFloors: Joi.string().when("land", {
      is: "built",
      then: Joi.string().valid("G", "G+1", "G+2", "G+3", "G+4").required(),
      otherwise: Joi.string().equal("NA"),
    }),
    bloodGroup: Joi.string()
      .valid("A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-", "UNKNOWN")
      .required(),
    monthlyMaintenance: Joi.bool().required(),
    maintenanceAmount: Joi.number().when("monthlyMaintenance", {
      is: true,
      then: Joi.number().valid(100, 300, 500).required(),
      otherwise: Joi.number().equal(-1),
    }),
    openingBalance: Joi.number().max(50000),
    borewell: Joi.bool().required(),
    siteDimensions: Joi.string()
      .valid("30x40", "30x50", "40x60", "50x80", "Other")
      .required(),
    siteAddress: Joi.string().min(4).max(30).required(),
    tenantResiding: Joi.bool().required(),
    ownerAddress: Joi.string().when("tenantResiding", {
      is: true,
      then: Joi.string().min(4).max(150).required(),
      otherwise: Joi.string().equal(""),
    }),
    membershipStartDate: Joi.date().required(),
    subscriptionStartDate: Joi.date().required(),
  }),
});

module.exports = schema;
