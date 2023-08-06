const router = require("express").Router();
const {
  createUser,
  loginUser,
  getUser,
} = require("../controllers/authController");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/user/:id", getUser);

module.exports = router;
