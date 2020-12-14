const logger = require("../common/logger")(__filename);
const userModel = require("./model");
const companyModel = require("../companies/model");
const userCompanyModel = require("../userCompany/model");
const { uploadFile } = require("../common/images");
const security = require("../common/security/security");
const {
  responseSuccess,
  responseError,
  SERVER_ERROR,
} = require("../common/response");
const { roleEnum } = require("../userCompany/roles");
const dbProcedures = require("../userCompany/dbProcsedures");
const config = require("../startup/config");

function buildJWT(user, companyId, role) {
  let jwtData = {
    sub: user._id,
    role,
    email: user.email_lower,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  if (companyId) jwtData.companyId = companyId;
  return jwtData;
}

module.exports.register = async (data) => {
  logger.info("register - email: " + data.email);
  let response = {};
  try {
    let { email } = data;
    let user = await userModel.findOne({ email: email.toLowerCase() });
    if (user) {
      logger.warn("User already exists with email: " + email);
      return responseError(400, "User already exists");
    }
    data.password = await security.crypt(data.password);
    data.email = data.email.toLowerCase();
    data.avatar = config.default_avatar;
    user = await userModel.create(data);
    let company = {
      name: user.firstName + " " + user.lastName,
      avatar: config.default_company_avatar,
    };
    company = await companyModel.create(company);
    let userCompany = {
      userId: user._id,
      companyId: company._id,
      role: roleEnum.manager,
    };
    await userCompanyModel.create(userCompany);
    let jwtData = buildJWT(user, company._id, roleEnum.manager);
    let jwt = security.signJwt(jwtData);
    response = { jwt, userId: user._id };
  } catch (e) {
    // Catch error and log it
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};
module.exports.login = async (data) => {
  logger.info("login - email: " + data.email);
  let response = {};
  let companies;
  let jwtData;
  try {
    let { email } = data;
    let user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      logger.warn("Email not found: " + email);
      return responseError(400, "Wrong Email or Password");
    }
    const validPassword = await security.validatePassword(
      data.password,
      user.password
    );
    if (!validPassword) {
      logger.warn("Password is invalid");
      return responseError(400, "Email or password are invalid");
    }
    //If user is super admin - returning ALL the companies
    if (user.role === roleEnum.superAdmin) {
      companies = await companyModel.find();
      if (companies.length === 1) {
        jwtData = buildJWT(user, companies[0]._id, roleEnum.superAdmin);
      } else {
        jwtData = buildJWT(user, null, roleEnum.superAdmin);
      }
    }
    //else- returning all the users companies
    else {
      companies = await dbProcedures.getUserCompanies(user._id, "");
      if (companies.length === 1) {
        jwtData = buildJWT(user, companies[0].companyId, companies[0].role);
      } else {
        jwtData = buildJWT(user);
      }
    }
    jwt = security.signJwt(jwtData);
    response = { jwt, size: companies.length, userId: user._id };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};

module.exports.profile = async (userId, companyId, role) => {
  logger.info(`profile - userId: ${userId}`);
  let response;
  try {
    let user = await userModel.findOne({ _id: userId }).select("-password");
    if (!user) {
      logger.warn("User not found");
      return responseError(404, "User not found");
    }
    response = { user, companyId, role };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};

module.exports.loadUser = async (userId) => {
  logger.info(`load user - userId: ${userId}`);
  let response;
  try {
    let user = await userModel.findOne({ _id: userId }).select("-password");
    if (!user) {
      logger.warn("User not found");
      return responseError(404, "User not found");
    }
    response = { user };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};
module.exports.loadAllUsers = async (companyId) => {
  logger.info(`load all users in the system`);
  let response;
  try {
    let users = await dbProcedures.getAllUsers(companyId);
    if (!users) {
      logger.warn("Users not found");
      return responseError(404, "User not found");
    }
    response = { users };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};

module.exports.updateUser = async (currentUser, data, updatedUserId) => {
  logger.info(`update profile - updatedUserId: ${updatedUserId}`);
  let response;
  try {
    let loggedInUser = await userModel.findOne({ _id: currentUser });
    if (updatedUserId !== currentUser) {
      if (loggedInUser.role === roleEnum.user) {
        logger.warn("Not Authorize");
        return responseError(403, "Not Authorize");
      }
    }
    let user = await userModel.findOne({ _id: updatedUserId });
    if (!user) {
      logger.warn("User not found");
      return responseError(404, "User not found");
    }
    if (data.secondaryEmail)
      data.secondaryEmail = data.secondaryEmail.toLowerCase();
    if (data.password) {
      console.log(data.password);
      data.password = await security.crypt(data.password);
    }
    let res = await userModel.updateOne({ _id: updatedUserId }, { $set: data });
    response = { ok: res.ok };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};
module.exports.deleteUser = async (companyId, deletedUserId) => {
  logger.info(`delete user - deletedUserId: ${deletedUserId}`);
  let response;
  //We got here only if the current user is MANAGER
  try {
    let userCompany = await userCompanyModel.findOne({
      companyId,
      userId: deletedUserId,
    });
    if (!userCompany) {
      logger.warn("Can't delete users from other companies");
      return responseError(403, "Can't delete users from other companies");
    }
    const res = await userCompanyModel.deleteOne({
      companyId,
      userId: deletedUserId,
    });
    response = { ok: res.ok };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};

module.exports.createUser = async (currentUser, data) => {
  logger.info(
    `create user by - userId: ${currentUser.sub} and for companyid: ${currentUser.companyId}`
  );
  let response;
  let res;
  try {
    //Only a manager can add users
    if (currentUser.role !== roleEnum.manager) {
      logger.warn("Not Authorize");
      return responseError(404, "User not Authorize");
    }
    data.email = data.email.toLowerCase();
    data.role = data.role.toLowerCase();
    const sameEmail = await userModel.findOne({ email: data.email });
    if (sameEmail) {
      logger.warn("User already exists with email: " + sameEmail.email);
      return responseError(400, "Email already exists");
    } else {
      data.avatar = config.default_avatar;
      data.password = await security.crypt(data.password);
      let userData = Object.assign({}, data);
      delete userData.role;
      let newUser = await userModel.create(userData);
      let userCompany = {
        userId: newUser._id,
        companyId: currentUser.companyId,
        role: data.role,
      };
      res = await userCompanyModel.create(userCompany);
    }
    response = { ok: res.ok };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};

module.exports.uploadImage = async (userId, file) => {
  logger.info(`upload profile image - userId: ${userId}`);
  let response;
  try {
    let user = await userModel.findOne({ _id: userId });
    if (!user) {
      logger.warn("User not found");
      return responseError(404, "User not found");
    }
    //delete current image

    //upload new image
    const imageData = await uploadFile(file);
    console.log(imageData);
    if (!imageData) {
      logger.warn("Can't upload image");
      return responseError(400, "Can't upload image");
    }
    const res = await userModel.updateOne({ _id: userId }, { $set: imageData });
    response = { ok: res.ok };
  } catch (e) {
    logger.error(e.message);
    return responseError(500, SERVER_ERROR);
  }
  return responseSuccess(response);
};
