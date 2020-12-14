const express = require("express");
const router = express.Router();

const controller = require("./controller");
//the companies of a loggedin user
router.get("/userCompanies", controller.getUserCompanies);
//all the users of a given company
router.get("/companieUsers/:id", controller.getCompanyUsers);
router.post("/addExistingUser", controller.addExistingUser);

module.exports = router;
