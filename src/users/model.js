const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 1,
      maxlength: 50,
      required: true,
    },
    lastName: {
      type: String,
      minlength: 1,
      maxlength: 50,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 120,
      required: true,
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 120,
      unique: true,
      required: true,
      index: true,
    },
    secondaryEmail: {
      type: String,
      minlength: 5,
      maxlength: 120,
      index: true,
    },
    phone: {
      type: String,
    },
    secondaryPhone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarId: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    //only for super admin
    role: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
