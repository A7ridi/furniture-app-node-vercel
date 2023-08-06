const router = require("express").Router();
const { orders } = require("../controllers/orderController");

router.get("/:id", orders);

module.exports = router;
