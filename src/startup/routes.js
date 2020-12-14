const users = require("../users/route");
const userCompany = require("../userCompany/route");
const companies = require("../companies/route");
const fileUpload = require("express-fileupload");

// This configs all routes
module.exports = function (app) {
  // All the APIs will go here
  app.use(fileUpload());
  app.use("/users", users);
  app.use("/userCompany", userCompany);
  app.use("/companies", companies);
  app.use((req, res, next) => {
    res.status(404).send({ error: "Not found", data: null });
  });
};
