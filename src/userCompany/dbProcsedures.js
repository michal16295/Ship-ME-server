const companyModel = require("../companies/model");
const userCompanyModel = require("./model");
const userModel = require("../users/model");
const ObjectId = require("mongodb").ObjectID;
const { roleEnum } = require("./roles");

module.exports.getUserCompanies = async (userId, search) => {
  let companies = await userCompanyModel.aggregate([
    {
      $match: {
        userId: ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "companyId",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $project: {
        userId: 1,
        role: 1,
        companyId: 1,
        phone: { $arrayElemAt: ["$company.phone", 0] },
        email: { $arrayElemAt: ["$company.email", 0] },
        website: { $arrayElemAt: ["$company.website", 0] },
        primaryContactName: {
          $arrayElemAt: ["$company.primaryContactName", 0],
        },
        primaryContactPhone: {
          $arrayElemAt: ["$company.primaryContactPhone", 0],
        },
        name: { $arrayElemAt: ["$company.name", 0] },
        address: { $arrayElemAt: ["$company.address", 0] },
        avatar: { $arrayElemAt: ["$company.avatar", 0] },
      },
    },
    {
      $match: {
        name: { $regex: search, $options: "i" },
      },
    },
  ]);
  return companies;
};

module.exports.getCompanyUsers = async (companyId, search) => {
  let users = await userCompanyModel.aggregate([
    {
      $match: {
        companyId: ObjectId(companyId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        role: 1,
        companyId: 1,
        userId: 1,
        firstName: { $arrayElemAt: ["$user.firstName", 0] },
        email: { $arrayElemAt: ["$user.email", 0] },
        lastName: { $arrayElemAt: ["$user.lastName", 0] },
        jobTitle: {
          $arrayElemAt: ["$user.jobTitle", 0],
        },
        avatar: {
          $arrayElemAt: ["$user.avatar", 0],
        },
      },
    },
    {
      $match: {
        firstName: { $regex: search, $options: "i" },
      },
    },
  ]);
  return users;
};
module.exports.getAllCompanies = async () => {
  let companies = await companyModel.aggregate([
    {
      $project: {
        companyId: "$_id",
        name: 1,
        avatar: 1,
        phone: 1,
        website: 1,
        address: 1,
        primaryContactName: 1,
        primaryContactPhone: 1,
      },
    },
  ]);
  return companies;
};
module.exports.getAllUsers = async (companyId) => {
  let usersId = await userCompanyModel.find({ companyId });
  usersId = usersId.map((user) => ObjectId(user.userId));
  let users = await userModel.aggregate([
    {
      $match: {
        role: { $ne: roleEnum.superAdmin },
        _id: { $nin: usersId },
      },
    },
    {
      $project: {
        _id: 0,
        value: "$_id",
        label: "$email",
      },
    },
  ]);
  return users;
};
