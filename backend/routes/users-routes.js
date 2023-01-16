const express = require("express");
const {
  getUsers,
  signup,
  login,
  updateUser,
  checkToken,
} = require("../controllers/users-controller");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", getUsers);

router.post("/signup", signup);

router.post("/login", login);

router.use(checkAuth);

router.patch("/", updateUser);

router.get("/checkToken", checkToken)

module.exports = router;
