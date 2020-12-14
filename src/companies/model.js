const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 1,
      maxlength: 50,
      required: true,
    },
    address: {
      type: String,
      minlength: 1,
      maxlength: 50,
    },
    city: {
      type: String,
      minlength: 1,
      maxlength: 120,
    },
    state: {
      type: String,
      minlength: 1,
      maxlength: 120,
    },
    zipCode: {
      type: String,
      minlength: 1,
      maxlength: 120,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      minlength: 5,
      unique: true,
    },
    website: {
      type: String,
      minlength: 5,
    },
    avatar: {
      type: String,
    },
    avatarId: {
      type: String,
    },
    primaryContactName: {
      type: String,
    },
    primaryContactPhone: {
      type: String,
    },
    primaryContactJobTitle: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
