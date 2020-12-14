const express = require("express");
const router = express.Router();
const { manager } = require("../userCompany/roles");
const controller = require("./controller");

router.get("/loadInitilCompany/:id", controller.getInitialCompany);
router.get("/loadCompany/:id", controller.getCompany);
router.post("/updateCompany/:id", controller.updateCompany);
router.post("/createCompany", controller.createCompany);
router.post("/uploadimage/:id", controller.uploadImage);
router.delete("/deleteCompany/:id", controller.deleteCompany);

module.exports = router;
