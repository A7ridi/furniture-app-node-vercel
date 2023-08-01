const router = require("express").Router();
const productsController = require("../controllers/productsController");

const { getAllProducts, createProduct, getProduct, searchProduct } =
  productsController;

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.get("/search/:key", searchProduct);
router.post("/create", createProduct);

module.exports = router;
