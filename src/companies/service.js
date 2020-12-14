const logger = require("../common/logger")(__filename);
const userModel = require("../users/model");
const companyModel = require("../companies/model");
const userCompanyModel = require("../userCompany/model");
const { uploadFile } = require("../common/images");
const config = require("../startup/config");
const {
  responseSuccess,
  responseError,
  SERVER_ERROR,
} = require("../common/response");
const security = require("../common/security/security");
const { roleEnum } = require("../userCompany/roles");

function buildJWT(user, companyId, role) {
  const jwtData = {
    sub: user._id,
    role: role,
    email: user.email_lower,
    firstName: user.firstName,
    lastName: user.lastName,
    companyId,
  };
  return jwtData;
}

module.exports.getInitialCompany = async (companyId, userId) => {
  logger.info(`company - companyId: ${companyId}`);
  let response;
  let role;
  try {
    let company = await companyModel.findOne({ _id: companyId });
    if (!company) {
      logger.warn("Company not found");
      return responseError(404, "Company not found");
    }
    let user = await userModel.findOne({ _id: userId });
    if (user.role === roleEnum.superAdmin) {
      role = roleEnum.superAdmin;
    } else {
      role = await userCompanyModel.findOne({ userId, companyId });
      role = role.role;
    }
    let jwtData = buildJWT(user, companyId, role);
    let jwt = security.signJwt(jwtData);
    response = { jwt, company };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};

module.exports.getCompany = async (companyId) => {
  logger.info(`company - companyId: ${companyId}`);
  let response;
  try {
    let company = await companyModel.findOne({ _id: companyId });
    if (!company) {
      logger.warn("Company not found");
      return responseError(404, "Company not found");
    }
    response = company;
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};
module.exports.updateCompany = async (companyId, currentUser, data) => {
  logger.info(`update company - companyId: ${companyId}`);
  let response;
  try {
    let company = await companyModel.findOne({ _id: companyId });
    if (!company) {
      logger.warn("Company not found");
      return responseError(404, "Company not found");
    }
    const userCompany = await userCompanyModel.findOne({
      userId: currentUser.sub,
    });
    if (!userCompany && currentUser.role !== roleEnum.superAdmin) {
      logger.warn("Not Authorize!");
      return responseError(403, "Not Authorize!");
    }
    let res = await companyModel.updateOne({ _id: companyId }, { $set: data });
    response = { ok: res.ok };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};
module.exports.createCompany = async (userId, data) => {
  logger.info(`create company by - userId: ${userId}`);
  let response;
  try {
    data.email = data.email.toLowerCase();
    const sameEmail = await companyModel.findOne({ email: data.email });
    if (sameEmail) {
      logger.warn("Email already exists");
      return responseError(400, "Email already exists");
    }
    data.avatar = config.default_company_avatar;
    let newCompany = await companyModel.create(data);
    let userCompany = {
      userId,
      companyId: newCompany._id,
      role: roleEnum.manager,
    };
    const res = await userCompanyModel.create(userCompany);
    response = { ok: res.ok };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};

module.exports.deleteCompany = async (companyId, currentUser) => {
  logger.info(`delete company by - userId: ${currentUser.sub}`);
  let response;
  try {
    const userPermission = await userCompanyModel.findOne({
      userId: currentUser.sub,
    });
    if (currentUser.role === roleEnum.user) {
      logger.warn("Not Authorize");
      return responseError(403, "Not Authorize to delete");
    }
    if (!userPermission && currentUser.role !== roleEnum.superAdmin) {
      logger.warn("Not Authorize");
      return responseError(403, "Not Authorize to delete");
    }
    await userCompanyModel.deleteMany({ companyId });
    const res = await companyModel.deleteOne({ _id: companyId });
    response = { ok: res.ok };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};

module.exports.uploadImage = async (companyId, file) => {
  logger.info(`upload company image - userId: ${companyId}`);
  let response;
  try {
    let user = await companyModel.findOne({ _id: companyId });
    if (!user) {
      logger.warn("Company not found");
      return responseError(404, "Company not found");
    }
    //delete current image

    //upload new image
    const imageData = await uploadFile(file);
    if (!imageData) {
      logger.warn("Can't upload image");
      return responseError(400, "Can't upload image");
    }
    const res = await companyModel.updateOne(
      { _id: companyId },
      { $set: imageData }
    );
    response = { ok: res.ok };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};
