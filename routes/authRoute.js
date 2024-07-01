const router = require("express").Router();
const { userRegister, userLogin } = require("../controller/authController");

router.post("/user-register", userRegister);
router.post("/usre-login", userLogin);

module.exports = router;
