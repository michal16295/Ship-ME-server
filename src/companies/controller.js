const companyServices = require("./service");
const logger = require("../common/logger")(__filename);
const { COOKIE_JWT } = require("../users/constants");

module.exports.getInitialCompany = async (req, res, next) => {
  logger.info("getInitialCompany");
  const { id } = req.params;
  const { sub } = req.decoded;
  let response = await companyServices.getInitialCompany(id, sub);
  if (response.status != 200) {
    res.status(response.status).send(response.data);
  } else {
    let jwt = response.data.jwt;
    let company = response.data.company;
    res.cookie(COOKIE_JWT, jwt);
    return res.send({ jwt, company });
  }
};
module.exports.getCompany = async (req, res, next) => {
  logger.info("getCompany");
  const { id } = req.params;
  let response = await companyServices.getCompany(id);
  return res.status(response.status).send(response.data);
};
module.exports.updateCompany = async (req, res, next) => {
  logger.info("updateCompany");
  const currentUser = req.decoded;
  const { id } = req.params;
  const data = req.body;
  let response = await companyServices.updateCompany(id, currentUser, data);
  return res.status(response.status).send(response.data);
};
module.exports.createCompany = async (req, res, next) => {
  logger.info("createCompany");
  const { sub } = req.decoded;
  const data = req.body;
  let response = await companyServices.createCompany(sub, data);
  return res.status(response.status).send(response.data);
};
module.exports.uploadImage = async (req, res, next) => {
  logger.info("upload company Image");
  const { id } = req.params;
  const file = req.files.file.data;
  let response = await companyServices.uploadImage(id, file);
  res.status(response.status).send(response.data);
};
module.exports.deleteCompany = async (req, res, next) => {
  logger.info("delete company");
  const { id } = req.params;
  const currentUser = req.decoded;
  let response = await companyServices.deleteCompany(id, currentUser);
  res.status(response.status).send(response.data);
};
