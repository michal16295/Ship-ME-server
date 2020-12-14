const logger = require("../common/logger")(__filename);
const userModel = require("./model");
const companyModel = require("../companies/model");
const userCompanyModel = require("../userCompany/model");
const {
  responseSuccess,
  responseError,
  SERVER_ERROR,
} = require("../common/response");
const dbProcedures = require("./dbProcsedures");
const { roleEnum } = require("./roles");

module.exports.getUserCompanies = async (userId, role, search) => {
  logger.info(`profile - userId: ${userId}`);
  let response;
  let companies;
  try {
    if (role === roleEnum.superAdmin) {
      companies = await dbProcedures.getAllCompanies();
    } else {
      companies = await dbProcedures.getUserCompanies(userId, search);
    }
    if (!companies) {
      logger.warn("Companies not found");
      return responseError(404, "Companies not found");
    }
    response = companies;
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};

module.exports.getCompanyUsers = async (currentUser, companyId, search) => {
  logger.info(
    `company users - userId: ${currentUser.sub} companyId: ${companyId}`
  );
  let response;
  try {
    let company = await companyModel.findOne({ _id: companyId });
    if (!company) {
      logger.warn("Company not found");
      return responseError(404, "Company not found");
    }
    if (
      currentUser.role !== roleEnum.manager &&
      currentUser.role !== roleEnum.superAdmin
    ) {
      logger.warn("Not Authorize");
      return responseError(400, "Not Authorize");
    }
    let users = await dbProcedures.getCompanyUsers(companyId, search);
    if (!users) {
      logger.warn("users not found");
      return responseError(404, "users not found");
    }
    response = users;
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};
module.exports.addExistingUser = async (currentUser, data) => {
  logger.info(
    `add existing user - userId: ${data.userId} companyId: ${data.companyId}`
  );
  let response;
  try {
    let company = await companyModel.findOne({ _id: data.companyId });
    if (!company) {
      logger.warn("Company not found");
      return responseError(404, "Company not found");
    }
    if (
      currentUser.role !== roleEnum.manager &&
      currentUser.role !== roleEnum.superAdmin
    ) {
      logger.warn("Not Authorize");
      return responseError(400, "Not Authorize");
    }
    data.role = data.role.toLowerCase();
    let res = await userCompanyModel.create(data);
    response = { ok: res.ok };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};
