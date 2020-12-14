const userCompanyServices = require("./service");
const logger = require("../common/logger")(__filename);

module.exports.getUserCompanies = async (req, res, next) => {
  logger.info("getUserCompanies");
  const { sub, role } = req.decoded;
  let { search } = req.query;
  if (search === "undefined" || search === undefined) {
    search = "";
  }
  let response = await userCompanyServices.getUserCompanies(sub, role, search);
  if (response.status != 200) {
    res.status(response.status).send(response.data);
  } else {
    res.status(response.status).send(response.data);
  }
};
module.exports.getCompanyUsers = async (req, res, next) => {
  logger.info("getCompanyUsers");
  const currentUser = req.decoded;
  const { id } = req.params;
  let { search } = req.query;
  if (search === "undefined" || search === undefined) {
    search = "";
  }
  let response = await userCompanyServices.getCompanyUsers(
    currentUser,
    id,
    search
  );
  if (response.status != 200) {
    res.status(response.status).send(response.data);
  } else {
    res.status(response.status).send(response.data);
  }
};
module.exports.addExistingUser = async (req, res, next) => {
  logger.info("add existing user to the company");
  const currentUser = req.decoded;
  const data = req.body;
  let response = await userCompanyServices.addExistingUser(currentUser, data);
  if (response.status != 200) {
    res.status(response.status).send(response.data);
  } else {
    res.status(response.status).send(response.data);
  }
};
