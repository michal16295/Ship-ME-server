const userServices = require("./service");
const logger = require("../common/logger")(__filename);
const { COOKIE_JWT } = require("./constants");

module.exports.register = async (req, res, next) => {
  logger.info("register");
  const data = req.body;
  let response = await userServices.register(data);
  if (response.status != 200) {
    res.status(response.status).send(response.data);
  } else {
    let jwt = response.data.jwt;
    let userId = response.data.userId;
    res.cookie(COOKIE_JWT, jwt);
    res.send({ jwt, userId });
  }
};
module.exports.login = async (req, res, next) => {
  logger.info("login");
  const data = req.body;
  let response = await userServices.login(data);
  if (response.status != 200) {
    res.status(response.status).send(response.data);
  } else {
    let jwt = response.data.jwt;
    let numOfCompanies = response.data.size;
    let userId = response.data.userId;
    res.cookie(COOKIE_JWT, jwt);
    res.send({ jwt, numOfCompanies, userId });
  }
};
module.exports.profile = async (req, res, next) => {
  logger.info("load current user");
  const { sub, companyId, role } = req.decoded;
  let response = await userServices.profile(sub, companyId, role);
  res.status(response.status).send(response.data);
};
module.exports.loadUser = async (req, res, next) => {
  logger.info("load user");
  const { id } = req.params;
  let response = await userServices.loadUser(id);
  res.status(response.status).send(response.data);
};

module.exports.updateUser = async (req, res, next) => {
  logger.info("update user");
  const currentUser = req.decoded.sub;
  const { id } = req.params;
  const data = req.body;
  let response = await userServices.updateUser(currentUser, data, id);
  res.status(response.status).send(response.data);
};
module.exports.createUser = async (req, res, next) => {
  logger.info("create user");
  const currentUser = req.decoded;
  const data = req.body;
  let response = await userServices.createUser(currentUser, data);
  res.status(response.status).send(response.data);
};
module.exports.deleteUser = async (req, res, next) => {
  logger.info("delete user");
  const { companyId } = req.decoded;
  const { id } = req.params;
  let response = await userServices.deleteUser(companyId, id);
  res.status(response.status).send(response.data);
};

module.exports.uploadImage = async (req, res, next) => {
  logger.info("upload Image");
  const { id } = req.params;
  const file = req.files.file.data;
  let response = await userServices.uploadImage(id, file);
  res.status(response.status).send(response.data);
};
module.exports.loadAllUsers = async (req, res, next) => {
  logger.info("load all users");
  const { companyId } = req.decoded;
  let response = await userServices.loadAllUsers(companyId);
  res.status(response.status).send(response.data);
};
