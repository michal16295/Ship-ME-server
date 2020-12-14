const roleEnum = {
  superAdmin: "superAdmin",
  manager: "manager",
  user: "user",
};

const roleLevels = {
  superAdmin: 100,
  manager: 50,
  user: 10,
};

function isRoleHigher(role, minRole) {
  let level1 = roleLevels[role] || 0;
  let level2 = roleLevels[minRole] || 0;
  return level1 >= level2;
}

function verifyRole(req, res, next, minRole) {
  let decoded = req.decoded;
  if (!decoded) {
    decoded = {};
  }
  let { role } = decoded;
  console.log(decoded);
  if (isRoleHigher(role, minRole)) {
    next();
  } else {
    res.status(403).send({ error: "Permission denied" });
  }
}

function superAdmin(req, res, next) {
  return verifyRole(req, res, next, roleEnum.superAdmin);
}

function manager(req, res, next) {
  return verifyRole(req, res, next, roleEnum.manager);
}

function user(req, res, next) {
  return verifyRole(req, res, next, roleEnum.user);
}
const roles = Object.values(roleEnum);

module.exports.superAdmin = superAdmin;
module.exports.manager = manager;
module.exports.user = user;
module.exports.roleEnum = roleEnum;
module.exports.roles = roles;
module.exports.roleLevels = roleLevels;
