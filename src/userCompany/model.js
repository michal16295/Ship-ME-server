const mongoose = require("mongoose");
const { roles } = require("./roles");
const userCompanySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    role: {
      type: String,
      enum: roles,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserCompany", userCompanySchema);
