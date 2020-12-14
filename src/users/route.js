const express = require("express");
const router = express.Router();
const { manager } = require("../userCompany/roles");

const userValidator = require("./validators");
const controller = require("./controller");

router.post("/register", userValidator.register, controller.register);
router.post("/login", controller.login);
router.get("/loadAllUsers", controller.loadAllUsers);
router.get("/profile", controller.profile);
router.post("/update/:id", controller.updateUser);
router.post("/uploadimage/:id", controller.uploadImage);
router.get("/loadUser/:id", controller.loadUser);
router.delete("/delete/:id", manager, controller.deleteUser);
router.post("/createUser", manager, controller.createUser);

module.exports = router;
