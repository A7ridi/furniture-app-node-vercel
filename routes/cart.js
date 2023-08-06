const router = require("express").Router();
const {
  getCart,
  addToCart,
  deleteCartItem,
  decrementCartItem,
} = require("../controllers/cartController");

router.get("/find/:id", getCart);
router.post("/", addToCart);
router.delete("/delete", deleteCartItem);
router.post("/quantity", decrementCartItem);

module.exports = router;
